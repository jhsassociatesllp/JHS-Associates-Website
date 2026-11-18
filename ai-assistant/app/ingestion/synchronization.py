"""Keeps Pinecone + the chunk registry in step with MongoDB (no Change Streams: the server is standalone).
Triggers: scheduled reconcile (worker), admin 'sync' endpoint, and a publish webhook from the main backend."""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from bson import ObjectId
from bson.errors import InvalidId

from app.core.config import Settings
from app.core.logging import get_logger
from app.database.mongodb import PublicReader
from app.ingestion.indexer import Indexer
from app.ingestion.mongodb_ingestion import INDEXED_COLLECTIONS, _CONVERTERS, collect_documents

log = get_logger("sync")


class SyncService:
    def __init__(self, settings: Settings, reader: PublicReader, indexer: Indexer, app_db):
        self.s, self.reader, self.indexer, self.db = settings, reader, indexer, app_db

    async def sync_collections(self, collections: Optional[List[str]] = None, force: bool = False) -> Dict[str, Any]:
        started = datetime.now(timezone.utc)
        report: Dict[str, Any] = {}
        grouped = await collect_documents(self.reader, self.s, collections)
        for col, docs in grouped.items():
            report[col] = await self.indexer.reconcile(docs, scope_prefix=f"mongodb:{col}:", force=force)
        await self.db.ai_sync_runs.insert_one({"kind": "mongodb", "collections": list(grouped), "report": report,
                                               "started_at": started, "finished_at": datetime.now(timezone.utc)})
        return report

    async def sync_one(self, collection: str, doc_id: str) -> Dict[str, Any]:
        """Webhook path: re-index (or remove) a single record right after it is published/edited/deleted."""
        if collection not in INDEXED_COLLECTIONS:
            return {"ignored": True, "reason": "collection not indexed"}
        try:
            oid: Any = ObjectId(doc_id)
        except (InvalidId, TypeError):
            oid = doc_id
        rows = await self.reader.find(collection, {"_id": oid}, limit=1)
        source_id = f"mongodb:{collection}:{doc_id}"
        if not rows:  # deleted, unpublished or no longer public
            return {"removed_vectors": await self.indexer.delete_source(source_id)}
        doc = _CONVERTERS[collection](self.s, rows[0])
        if not doc or not doc.text.strip():
            return {"removed_vectors": await self.indexer.delete_source(source_id)}
        return await self.indexer.upsert_document(doc)

    async def status(self) -> Dict[str, Any]:
        last = await self.db.ai_sync_runs.find({}).sort("finished_at", -1).limit(1).to_list(1)
        errors = await self.db.ai_sync_log.find({"status": "error"}).sort("created_at", -1).limit(10).to_list(10)
        return {
            "sources": await self.db.ai_sources.count_documents({}),
            "chunks": await self.db.ai_chunks.count_documents({}),
            "last_run": ({"finished_at": last[0]["finished_at"].isoformat(), "report": last[0]["report"]} if last else None),
            "recent_errors": [{"source_id": e.get("source_id"), "error": e.get("error"),
                               "at": e["created_at"].isoformat()} for e in errors],
        }
