"""Idempotent chunk -> embed -> Pinecone pipeline with a Mongo registry so updates and deletions are exact.

Registry (assistant's own DB):
  ai_sources : one row per source doc  {_id: source_id, namespace, content_hash, embedding_version, chunk_ids}
  ai_chunks  : one row per chunk       {_id: chunk_id, source_id, namespace, text, title, url, ...}  (also feeds BM25)
  ai_sync_log: one row per sync event
"""
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Optional

from app.core.config import Settings
from app.core.logging import get_logger
from app.database.pinecone import VectorStore
from app.ingestion.chunking import chunk_text
from app.ingestion.documents import SourceDoc
from app.llm.openai_client import LLM

log = get_logger("indexer")


def _now():
    return datetime.now(timezone.utc)


class Indexer:
    def __init__(self, settings: Settings, llm: LLM, vectors: VectorStore, app_db):
        self.s, self.llm, self.vectors, self.db = settings, llm, vectors, app_db

    async def _log(self, **row) -> None:
        await self.db.ai_sync_log.insert_one({**row, "created_at": _now()})

    async def upsert_document(self, doc: SourceDoc, force: bool = False) -> Dict[str, int]:
        """Index one document. No-op when its content hash and embedding settings are unchanged."""
        existing = await self.db.ai_sources.find_one({"_id": doc.source_id})
        if (
            existing and not force and existing.get("content_hash") == doc.content_hash
            and existing.get("embedding_version") == self.s.embedding_version
        ):
            return {"skipped": 1, "chunks": 0, "upserted": 0, "deleted": 0}

        chunks = chunk_text(doc.text, self.s.chunk_max_tokens, self.s.chunk_overlap_tokens, self.s.chunk_min_tokens)
        new_ids = [f"{doc.source_id}#{c.index}" for c in chunks]
        # What is embedded carries the title and section so the vector "knows" what it belongs to.
        embed_inputs = [f"{doc.title}\n{c.heading_path}\n\n{c.text}".strip() for c in chunks]
        vectors = await self.llm.embed(embed_inputs) if chunks else []

        records = []
        rows = []
        for c, cid, vec in zip(chunks, new_ids, vectors):
            md = {
                "chunk_id": cid, "source_type": doc.source_type, "source_id": doc.source_id, "title": doc.title,
                "url": doc.url, "category": doc.category, "access_level": doc.access_level,
                "publication_status": "published", "chunk_index": c.index, "heading": c.heading_path,
                "content_hash": doc.content_hash, "is_listing_url": doc.is_listing_url,
                "last_updated": doc.last_updated.isoformat() if doc.last_updated else None, "text": c.text,
            }
            records.append({"id": cid, "values": vec, "metadata": md})
            rows.append({
                "_id": cid, "source_id": doc.source_id, "namespace": doc.namespace, "title": doc.title, "url": doc.url,
                "category": doc.category, "access_level": doc.access_level, "text": c.text, "heading": c.heading_path,
                "chunk_index": c.index, "is_listing_url": doc.is_listing_url, "updated_at": _now(),
            })

        upserted = await self.vectors.upsert(doc.namespace, records) if records else 0
        old_ids = set((existing or {}).get("chunk_ids", []))
        stale = sorted(old_ids - set(new_ids))
        if stale:
            await self.vectors.delete((existing or {}).get("namespace", doc.namespace), stale)
        await self.db.ai_chunks.delete_many({"source_id": doc.source_id})
        if rows:
            await self.db.ai_chunks.insert_many(rows)
        await self.db.ai_sources.replace_one(
            {"_id": doc.source_id},
            {"_id": doc.source_id, "namespace": doc.namespace, "title": doc.title, "url": doc.url,
             "category": doc.category, "content_hash": doc.content_hash, "embedding_version": self.s.embedding_version,
             "chunk_ids": new_ids, "source_type": doc.source_type, "updated_at": _now()},
            upsert=True,
        )
        res = {"skipped": 0, "chunks": len(chunks), "upserted": upserted, "deleted": len(stale)}
        await self._log(source_type=doc.source_type, source_id=doc.source_id, event="upsert", status="ok", **res)
        return res

    async def delete_source(self, source_id: str) -> int:
        row = await self.db.ai_sources.find_one({"_id": source_id})
        if not row:
            return 0
        ids = row.get("chunk_ids", [])
        if ids:
            await self.vectors.delete(row["namespace"], ids)
        await self.db.ai_chunks.delete_many({"source_id": source_id})
        await self.db.ai_sources.delete_one({"_id": source_id})
        await self._log(source_type=row.get("source_type"), source_id=source_id, event="delete", status="ok",
                        deleted=len(ids))
        return len(ids)

    async def reconcile(self, docs: Iterable[SourceDoc], scope_prefix: str, force: bool = False) -> Dict[str, int]:
        """Upsert every current doc and remove vectors for sources under `scope_prefix` that no longer exist
        (deleted / unpublished upstream)."""
        totals = {"docs": 0, "skipped": 0, "chunks": 0, "upserted": 0, "deleted": 0, "removed_sources": 0, "errors": 0}
        seen = set()
        for d in docs:
            seen.add(d.source_id)
            try:
                r = await self.upsert_document(d, force=force)
                totals["docs"] += 1
                for k in ("skipped", "chunks", "upserted", "deleted"):
                    totals[k] += r[k]
            except Exception as e:  # keep going; failures are logged and visible in ai_sync_log, never silent
                totals["errors"] += 1
                log.error("index_failed", extra={"ctx": {"source_id": d.source_id, "err": type(e).__name__}})
                await self._log(source_type=d.source_type, source_id=d.source_id, event="upsert", status="error",
                                error=f"{type(e).__name__}: {str(e)[:300]}")
        async for row in self.db.ai_sources.find({"_id": {"$regex": f"^{scope_prefix}"}}, {"_id": 1}):
            if row["_id"] not in seen:
                totals["deleted"] += await self.delete_source(row["_id"])
                totals["removed_sources"] += 1
        return totals
