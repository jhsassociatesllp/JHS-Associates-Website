"""Admin-only knowledge sync + webhooks (protected by the admin key; never reachable by the public chat path)."""
import asyncio
from typing import List, Optional

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

from app.container import Services
from app.core.security import require_admin
from app.ingestion.mongodb_ingestion import INDEXED_COLLECTIONS

router = APIRouter(dependencies=[Depends(require_admin)])
_running: dict = {"task": None}


def _svc(request: Request) -> Services:
    return request.app.state.services


class SyncRequest(BaseModel):
    collections: Optional[List[str]] = None
    force: bool = False


class MongoWebhook(BaseModel):
    collection: str = Field(max_length=64)
    doc_id: str = Field(max_length=64)
    event: str = Field(default="update", max_length=16)  # insert | update | delete


@router.post("/api/v1/knowledge/sync")
async def trigger_sync(request: Request, body: SyncRequest):
    svc = _svc(request)
    task = _running["task"]
    if task and not task.done():
        return {"started": False, "reason": "a sync is already running"}
    cols = [c for c in (body.collections or INDEXED_COLLECTIONS) if c in INDEXED_COLLECTIONS]
    _running["task"] = asyncio.create_task(svc.sync.sync_collections(cols, force=body.force))
    return {"started": True, "collections": cols}


@router.get("/api/v1/knowledge/sync-status")
async def sync_status(request: Request):
    svc = _svc(request)
    out = await svc.sync.status()
    t = _running["task"]
    out["running"] = bool(t and not t.done())
    return out


@router.post("/api/v1/webhooks/mongodb")
async def mongodb_webhook(request: Request, body: MongoWebhook):
    """Called by the main backend after a record is published/edited/deleted -> immediate, single-record re-index."""
    return await _svc(request).sync.sync_one(body.collection, body.doc_id)


@router.get("/api/v1/admin/health")
async def deep_health(request: Request):
    svc = _svc(request)
    out = {}
    try:
        out["mongo"] = await svc.mongo.ping()
    except Exception as e:
        out["mongo"] = f"error: {type(e).__name__}"
    try:
        out["pinecone"] = await svc.vectors.verify()
    except Exception as e:
        out["pinecone"] = f"error: {type(e).__name__}"
    out["models"] = {"chat": svc.settings.chat_model, "router": svc.settings.router_model,
                     "embedding": f"{svc.settings.embedding_model}@{svc.settings.embedding_dimensions}"}
    return out
