"""Pinecone wrapper (sync SDK run in worker threads). Pinecone is a retrieval index, never the source of truth."""
import asyncio
from typing import Any, Dict, Iterable, List, Optional, Sequence

from pinecone import Pinecone
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import Settings
from app.core.exceptions import UpstreamError
from app.core.logging import get_logger

log = get_logger("pinecone")

UPSERT_BATCH = 100
DELETE_BATCH = 500
_retry = retry(stop=stop_after_attempt(4), wait=wait_exponential(multiplier=1, min=1, max=10), reraise=True)


def clean_metadata(md: Dict[str, Any]) -> Dict[str, Any]:
    """Pinecone metadata must be str/number/bool/list[str]; None is not allowed."""
    out: Dict[str, Any] = {}
    for k, v in md.items():
        if v is None:
            continue
        if isinstance(v, (str, int, float, bool)):
            out[k] = v
        elif isinstance(v, list):
            out[k] = [str(x) for x in v]
        else:
            out[k] = str(v)
    return out


class VectorStore:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._pc = Pinecone(api_key=settings.pinecone_api_key)
        self._index = None

    def _idx(self):
        if self._index is None:
            desc = self._pc.describe_index(self.settings.ai_pinecone_index)
            if int(desc.dimension) != self.settings.embedding_dimensions:
                raise UpstreamError(
                    f"Pinecone index dimension {desc.dimension} != EMBEDDING_DIMENSIONS {self.settings.embedding_dimensions}"
                )
            self._index = self._pc.Index(host=desc.host)
        return self._index

    async def verify(self) -> Dict[str, Any]:
        def _do():
            idx = self._idx()
            stats = idx.describe_index_stats()
            return {"vectors": stats.total_vector_count, "namespaces": sorted((stats.namespaces or {}).keys())}
        return await asyncio.to_thread(_do)

    @_retry
    def _upsert_sync(self, namespace: str, batch: List[Dict[str, Any]]) -> None:
        self._idx().upsert(vectors=batch, namespace=namespace, show_progress=False)

    async def upsert(self, namespace: str, records: Sequence[Dict[str, Any]]) -> int:
        """records: {id, values, metadata}"""
        n = 0
        for i in range(0, len(records), UPSERT_BATCH):
            batch = [
                {"id": r["id"], "values": r["values"], "metadata": clean_metadata(r.get("metadata", {}))}
                for r in records[i:i + UPSERT_BATCH]
            ]
            await asyncio.to_thread(self._upsert_sync, namespace, batch)
            n += len(batch)
        return n

    @_retry
    def _delete_sync(self, namespace: str, ids: List[str]) -> None:
        self._idx().delete(ids=ids, namespace=namespace)

    async def delete(self, namespace: str, ids: Iterable[str]) -> int:
        ids = list(ids)
        for i in range(0, len(ids), DELETE_BATCH):
            await asyncio.to_thread(self._delete_sync, namespace, ids[i:i + DELETE_BATCH])
        return len(ids)

    @_retry
    def _query_sync(self, vector, namespace, top_k, flt):
        return self._idx().query(
            vector=vector, top_k=top_k, namespace=namespace, filter=flt, include_metadata=True
        )

    async def query(
        self, vector: Sequence[float], namespace: str, top_k: int, flt: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        res = await asyncio.to_thread(self._query_sync, list(vector), namespace, top_k, flt)
        return [
            {"id": m.id, "score": float(m.score), "metadata": dict(m.metadata or {}), "namespace": namespace}
            for m in (res.matches or [])
        ]
