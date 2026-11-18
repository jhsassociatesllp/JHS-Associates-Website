"""Public chat endpoints. Keeps the existing widget's contract (SSE `delta`/`done` events or a JSON body) and adds
session/conversation ids, sources and suggested questions."""
import json
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Any, AsyncIterator, Dict, List, Optional

from fastapi import APIRouter, Header, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from app.answer_builders import Answer
from app.container import Services
from app.core.exceptions import BadRequest, UpstreamError
from app.core.logging import get_logger, redact
from app.core.security import clean_user_text, client_ip

log = get_logger("chat")
router = APIRouter()


class HistoryItem(BaseModel):
    role: str = Field(max_length=12)
    text: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: List[HistoryItem] = Field(default_factory=list, max_length=20)  # legacy: client-held history
    session_id: Optional[str] = Field(default=None, max_length=64)
    conversation_id: Optional[str] = Field(default=None, max_length=64)


def _svc(request: Request) -> Services:
    return request.app.state.services


def _payload(ans: Answer, sid: str, cid: str) -> Dict[str, Any]:
    m = ans.meta
    return {
        "reply": ans.reply, "links": ans.links, "people": ans.people, "items": ans.items, "sources": ans.sources,
        "suggested_questions": ans.suggested_questions, "session_id": sid, "conversation_id": cid,
        "response_metadata": {k: m.get(k) for k in ("category", "latency_ms", "refused", "deterministic") if k in m},
    }


def _client_history(items: List[HistoryItem], n: int) -> List[Dict[str, str]]:
    out = []
    for h in items[-n:]:
        role = "assistant" if h.role in ("bot", "assistant") else "user"
        out.append({"role": role, "text": clean_user_text(h.text)})
    return out


async def _finalise(svc: Services, cid: str, ans: Answer, message: str) -> None:
    try:
        await svc.conversations.add(cid, "assistant", ans.reply, category=ans.meta.get("category"))
        await svc.mongo.app.ai_query_log.insert_one({
            "conversation_id": cid, "question": redact(message), "category": ans.meta.get("category"),
            "refused": bool(ans.meta.get("refused") or ans.meta.get("no_evidence") or ans.meta.get("rejected")),
            "deterministic": ans.meta.get("deterministic"), "latency_ms": ans.meta.get("latency_ms"),
            "tokens": ans.meta.get("tokens"), "validation_flags": ans.meta.get("validation_flags"),
            "created_at": datetime.now(timezone.utc),
        })
        await svc.conversations.maybe_summarize(cid)
    except Exception as e:  # bookkeeping must never break the visitor's answer
        log.error("finalise_failed", extra={"ctx": {"err": type(e).__name__}})


async def handle_chat(request: Request, body: ChatRequest, force_stream: bool = False):
    svc = _svc(request)
    svc.limiter.check(client_ip(request))
    message = clean_user_text(body.message, svc.settings)
    if not message:
        raise BadRequest("empty message")
    sid, cid, is_new = await svc.conversations.open(body.session_id, body.conversation_id)
    history = (_client_history(body.history, svc.settings.history_window_messages) if is_new
               else await svc.conversations.history(cid))
    await svc.conversations.add(cid, "user", message)

    gen = svc.assistant.run(message, history)
    try:
        first = await gen.__anext__()
    except StopAsyncIteration:
        raise UpstreamError("assistant produced no output")

    if first[0] == "done" and not force_stream:
        ans: Answer = first[1]
        await _finalise(svc, cid, ans, message)
        return JSONResponse(_payload(ans, sid, cid))

    async def sse() -> AsyncIterator[str]:
        try:
            event = first
            while True:
                kind, val = event
                if kind == "delta":
                    yield f"data: {json.dumps({'delta': val})}\n\n"
                else:
                    ans: Answer = val
                    await _finalise(svc, cid, ans, message)
                    yield f"data: {json.dumps({'done': True, **_payload(ans, sid, cid)}, default=str)}\n\n"
                    return
                event = await gen.__anext__()
        except StopAsyncIteration:
            yield f"data: {json.dumps({'error': 'The assistant ended unexpectedly. Please try again.'})}\n\n"
        except Exception as e:
            log.error("stream_failed", extra={"ctx": {"err": type(e).__name__}})
            yield f"data: {json.dumps({'error': 'The assistant is temporarily unavailable. Please try again shortly.'})}\n\n"

    return StreamingResponse(sse(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/api/chat")          # legacy path used by the existing widget via nginx (/chatbot-api/chat)
@router.post("/api/v1/chat")
async def chat(request: Request, body: ChatRequest):
    return await handle_chat(request, body)


@router.post("/api/v1/chat/stream")
async def chat_stream(request: Request, body: ChatRequest):
    return await handle_chat(request, body, force_stream=True)


@router.get("/api/v1/conversations/{conversation_id}")
async def get_conversation(request: Request, conversation_id: str, x_session_id: str = Header(default="")):
    return await _svc(request).conversations.get(conversation_id, x_session_id)


@router.delete("/api/v1/conversations/{conversation_id}")
async def delete_conversation(request: Request, conversation_id: str, x_session_id: str = Header(default="")):
    await _svc(request).conversations.delete(conversation_id, x_session_id)
    return {"deleted": True}
