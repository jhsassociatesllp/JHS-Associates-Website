"""MongoDB access: a guarded reader for public content, and the assistant's own database."""
from typing import Any, Dict, List, Optional, Sequence, Tuple

from pymongo import AsyncMongoClient

from app.core.config import Settings
from app.core.exceptions import AccessDenied
from app.database.allowlist import projection_for, spec_for

MAX_READ = 1000


def _no_operators_in_keys(obj: Any) -> None:
    """Defence in depth: refuse server-side JS and unknown top-level operators in any query we are handed."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("$where", "$function", "$accumulator", "$expr"):
                raise AccessDenied("operator not allowed")
            _no_operators_in_keys(v)
    elif isinstance(obj, list):
        for v in obj:
            _no_operators_in_keys(v)


class PublicReader:
    """Read-only, allowlisted access to the website database. All methods enforce the collection allowlist, the
    per-collection field projection and the per-collection base filter (e.g. leadership.status == 'Active')."""

    def __init__(self, db):
        self._db = db

    async def find(
        self,
        collection: str,
        query: Optional[Dict[str, Any]] = None,
        *,
        sort: Optional[Sequence[Tuple[str, int]]] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        spec = spec_for(collection)
        query = query or {}
        _no_operators_in_keys(query)
        full = {"$and": [spec.base_filter, query]} if spec.base_filter and query else (spec.base_filter or query)
        cursor = self._db[collection].find(full, projection_for(collection))
        if sort:
            cursor = cursor.sort(list(sort))
        cursor = cursor.limit(min(max(limit, 1), MAX_READ))
        return await cursor.to_list(length=None)

    async def count(self, collection: str, query: Optional[Dict[str, Any]] = None) -> int:
        spec = spec_for(collection)
        query = query or {}
        _no_operators_in_keys(query)
        full = {"$and": [spec.base_filter, query]} if spec.base_filter and query else (spec.base_filter or query)
        return await self._db[collection].count_documents(full)


class Mongo:
    def __init__(self, settings: Settings, client: Any = None):
        self.settings = settings
        self.client = client or AsyncMongoClient(settings.mongo_uri, serverSelectionTimeoutMS=8000)
        self.public = PublicReader(self.client[settings.source_db_name])
        self.app = self.client[settings.app_db_name]

    async def ping(self) -> bool:
        await self.client.admin.command("ping")
        return True

    async def ensure_indexes(self) -> None:
        a = self.app
        await a.ai_chunks.create_index("source_id")
        await a.ai_chunks.create_index("namespace")
        await a.ai_sources.create_index("namespace")
        await a.ai_conversations.create_index("session_id")
        await a.ai_messages.create_index([("conversation_id", 1), ("created_at", 1)])
        await a.ai_sync_log.create_index([("created_at", -1)])
        await a.ai_query_log.create_index([("created_at", -1)])

    async def close(self) -> None:
        close = getattr(self.client, "close", None)
        if close:
            res = close()
            if hasattr(res, "__await__"):
                await res
