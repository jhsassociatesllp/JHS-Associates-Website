"""Dense (Pinecone) + keyword (BM25) retrieval fused with Reciprocal Rank Fusion, PUBLIC content only."""
import asyncio
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence

from app.core.config import Settings
from app.core.logging import get_logger
from app.database.pinecone import VectorStore
from app.llm.openai_client import LLM
from app.retrieval.lexical import LexicalIndex

log = get_logger("retrieval")

ALL_NAMESPACES = ["company", "articles", "blogs", "knowledge", "regulatory", "publications", "website",
                  "company_documents"]
CATEGORY_NAMESPACES = {
    "ARTICLES": ["articles", "blogs"], "BLOGS": ["blogs", "articles"], "REGULATORY": ["regulatory"],
    "KNOWLEDGE_RESOURCES": ["knowledge", "publications", "regulatory"],
    "SERVICES": ["company", "website", "company_documents"], "INDUSTRIES": ["company", "website", "company_documents"],
    "COMPANY_PROFILE": ["company", "website", "company_documents"], "LOCATIONS": ["website", "company_documents", "company"],
    "CAREERS": ["company", "website"], "GENERAL_KNOWLEDGE": ["knowledge", "articles", "regulatory", "blogs"],
}


@dataclass
class Evidence:
    chunk_id: str
    title: str
    url: str
    text: str
    category: str
    is_listing_url: bool
    namespace: str
    heading: str = ""
    dense_score: Optional[float] = None
    lexical_score: Optional[float] = None
    fused: float = 0.0
    rerank_grade: Optional[int] = None   # 0..3 from the reranker, when used
    date: Optional[str] = None


class HybridRetriever:
    def __init__(self, settings: Settings, llm: LLM, vectors: VectorStore, lexical: LexicalIndex):
        self.s, self.llm, self.vectors, self.lexical = settings, llm, vectors, lexical

    async def retrieve(self, query: str, category: Optional[str] = None, top_k: Optional[int] = None,
                       namespaces: Optional[Sequence[str]] = None) -> List[Evidence]:
        k = top_k or self.s.retrieval_top_k
        ns = list(namespaces or CATEGORY_NAMESPACES.get(category or "", ALL_NAMESPACES))
        found = await self._run(query, ns, k)
        if len(found) < 3 and set(ns) != set(ALL_NAMESPACES):   # narrowed too far: widen once
            found = await self._run(query, ALL_NAMESPACES, k)
        return found

    async def _run(self, query: str, namespaces: List[str], k: int) -> List[Evidence]:
        qvec = await self.llm.embed_one(query)
        flt = {"access_level": {"$eq": "PUBLIC"}}
        dense_lists = await asyncio.gather(
            *[self.vectors.query(qvec, n, k, flt) for n in namespaces], return_exceptions=True
        )
        dense: List[Dict[str, Any]] = []
        for n, res in zip(namespaces, dense_lists):
            if isinstance(res, Exception):
                log.warning("dense_query_failed", extra={"ctx": {"ns": n, "err": type(res).__name__}})
                continue
            dense.extend(res)
        dense.sort(key=lambda m: -m["score"])
        dense = dense[:k]
        lexical = await self.lexical.search(query, k, namespaces)

        by_id: Dict[str, Evidence] = {}
        rrf = self.s.rrf_k

        def upsert(cid: str, build) -> Evidence:
            if cid not in by_id:
                by_id[cid] = build()
            return by_id[cid]

        for rank, m in enumerate(dense):
            md = m["metadata"]
            ev = upsert(m["id"], lambda md=md, m=m: Evidence(
                chunk_id=m["id"], title=md.get("title", ""), url=md.get("url", ""), text=md.get("text", ""),
                category=md.get("category", ""), is_listing_url=bool(md.get("is_listing_url")),
                namespace=m["namespace"], heading=md.get("heading", ""), date=md.get("last_updated")))
            ev.dense_score = m["score"]
            ev.fused += 1.0 / (rrf + rank + 1)
        for rank, h in enumerate(lexical):
            r = h["row"]
            ev = upsert(h["id"], lambda r=r, h=h: Evidence(
                chunk_id=h["id"], title=r.get("title", ""), url=r.get("url", ""), text=r.get("text", ""),
                category=r.get("category", ""), is_listing_url=bool(r.get("is_listing_url")),
                namespace=r.get("namespace", ""), heading=r.get("heading", "")))
            ev.lexical_score = h["score"]
            ev.fused += 1.0 / (rrf + rank + 1)
        return sorted(by_id.values(), key=lambda e: -e.fused)[:k * 2]
