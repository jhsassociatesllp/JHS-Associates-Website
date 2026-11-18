"""Keyword (BM25) retrieval over the same chunks that are in Pinecone. Catches names, acronyms and exact terms
that dense search can miss. Pinecone's serverless dense index has no sparse side, so this runs in-process."""
import re
import time
from typing import Any, Dict, List, Optional, Sequence

from rank_bm25 import BM25Okapi

_TOKEN = re.compile(r"[a-z0-9]+")
_STOP = {"the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "at", "by", "with", "what", "who",
         "do", "does", "you", "your", "me", "tell", "about", "jhs"}


def tokenize(text: str) -> List[str]:
    return [t for t in _TOKEN.findall((text or "").lower()) if t not in _STOP]


class LexicalIndex:
    def __init__(self, app_db, refresh_seconds: int = 120):
        self.db, self.refresh = app_db, refresh_seconds
        self._rows: List[Dict[str, Any]] = []
        self._bm25: Optional[BM25Okapi] = None
        self._loaded_at = 0.0
        self._signature: Any = None

    async def _signature_now(self):
        n = await self.db.ai_chunks.count_documents({})
        latest = await self.db.ai_chunks.find({}, {"updated_at": 1}).sort("updated_at", -1).limit(1).to_list(1)
        return (n, latest[0]["updated_at"] if latest else None)

    async def ensure_loaded(self, force: bool = False) -> None:
        if not force and self._bm25 is not None and time.monotonic() - self._loaded_at < self.refresh:
            return
        sig = await self._signature_now()
        self._loaded_at = time.monotonic()
        if not force and sig == self._signature and self._bm25 is not None:
            return
        rows = await self.db.ai_chunks.find({"access_level": "PUBLIC"}).to_list(length=None)
        self._rows = rows
        self._bm25 = BM25Okapi([tokenize(f"{r.get('title', '')} {r.get('heading', '')} {r['text']}") for r in rows]) if rows else None
        self._signature = sig

    async def search(self, query: str, top_k: int, namespaces: Optional[Sequence[str]] = None) -> List[Dict[str, Any]]:
        await self.ensure_loaded()
        toks = tokenize(query)
        if not self._bm25 or not toks:
            return []
        scores = self._bm25.get_scores(toks)
        ranked = sorted(range(len(scores)), key=lambda i: -scores[i])
        out: List[Dict[str, Any]] = []
        for i in ranked:
            if scores[i] <= 0:
                break
            r = self._rows[i]
            if namespaces and r.get("namespace") not in namespaces:
                continue
            out.append({"id": r["_id"], "score": float(scores[i]), "row": r})
            if len(out) >= top_k:
                break
        return out
