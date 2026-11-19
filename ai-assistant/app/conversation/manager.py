"""Conversation + session management in the assistant's own MongoDB database.

Isolation: ids are server-issued random UUIDs; a conversation is only readable with the session_id that created it.
Only a recent window (plus a rolling summary) is ever sent to the model."""
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from app.core.config import Settings
from app.core.exceptions import NotFound
from app.core.logging import get_logger
from app.llm.openai_client import LLM

log = get_logger("conversation")


def _now():
    return datetime.now(timezone.utc)


class ConversationManager:
    def __init__(self, settings: Settings, app_db, llm: LLM):
        self.s, self.db, self.llm = settings, app_db, llm

    async def open(self, session_id: Optional[str], conversation_id: Optional[str]) -> Tuple[str, str, bool]:
        """Returns (session_id, conversation_id, is_new). A supplied conversation must belong to the supplied session;
        otherwise a NEW conversation is started (never leak or reuse someone else's)."""
        if conversation_id and session_id:
            conv = await self.db.ai_conversations.find_one({"_id": conversation_id, "session_id": session_id})
            if conv:
                return session_id, conversation_id, False
        sid = session_id if (session_id and self._valid(session_id)) else uuid.uuid4().hex
        cid = uuid.uuid4().hex
        await self.db.ai_conversations.insert_one(
            {"_id": cid, "session_id": sid, "created_at": _now(), "updated_at": _now(), "summary": "", "message_count": 0})
        return sid, cid, True

    @staticmethod
    def _valid(value: str) -> bool:
        return 16 <= len(value) <= 64 and value.isalnum()

    async def history(self, conversation_id: str, n: Optional[int] = None) -> List[Dict[str, str]]:
        n = n or self.s.history_window_messages
        rows = await self.db.ai_messages.find({"conversation_id": conversation_id}).sort("created_at", -1).limit(n).to_list(n)
        msgs = [{"role": r["role"], "text": r["text"]} for r in reversed(rows)]
        conv = await self.db.ai_conversations.find_one({"_id": conversation_id}, {"summary": 1})
        if conv and conv.get("summary"):
            msgs.insert(0, {"role": "assistant", "text": f"(Summary of the earlier conversation: {conv['summary']})"})
        return msgs

    async def add(self, conversation_id: str, role: str, text: str, **meta: Any) -> None:
        await self.db.ai_messages.insert_one(
            {"conversation_id": conversation_id, "role": role, "text": text, "created_at": _now(), **meta})
        await self.db.ai_conversations.update_one(
            {"_id": conversation_id}, {"$set": {"updated_at": _now()}, "$inc": {"message_count": 1}})

    async def get(self, conversation_id: str, session_id: str) -> Dict[str, Any]:
        conv = await self.db.ai_conversations.find_one({"_id": conversation_id, "session_id": session_id})
        if not conv:
            raise NotFound("conversation not found for this session")
        msgs = await self.db.ai_messages.find({"conversation_id": conversation_id}).sort("created_at", 1).to_list(500)
        return {"conversation_id": conversation_id, "messages": [{"role": m["role"], "text": m["text"],
                                                                  "created_at": m["created_at"].isoformat()} for m in msgs]}

    async def delete(self, conversation_id: str, session_id: str) -> None:
        res = await self.db.ai_conversations.delete_one({"_id": conversation_id, "session_id": session_id})
        if not res.deleted_count:
            raise NotFound("conversation not found for this session")
        await self.db.ai_messages.delete_many({"conversation_id": conversation_id})

    async def maybe_summarize(self, conversation_id: str) -> None:
        conv = await self.db.ai_conversations.find_one({"_id": conversation_id})
        if not conv or conv.get("message_count", 0) < self.s.summarize_after_messages:
            return
        if conv.get("message_count", 0) - conv.get("summarized_at_count", 0) < self.s.summarize_after_messages // 2:
            return
        rows = await self.db.ai_messages.find({"conversation_id": conversation_id}).sort("created_at", 1).to_list(200)
        transcript = "\n".join(f"{r['role']}: {r['text'][:400]}" for r in rows[:-self.s.history_window_messages])
        if not transcript:
            return
        try:
            summary = await self.llm.chat(
                [{"role": "system", "content": "Summarise this website-assistant conversation in under 120 words: what the "
                  "visitor asked about and what was answered (names of services/people/items mentioned in order). Plain text."},
                 {"role": "user", "content": transcript}],
                model=self.s.router_model, max_tokens=250)
        except Exception as e:
            log.warning("summary_failed", extra={"ctx": {"err": type(e).__name__}})
            return
        await self.db.ai_conversations.update_one(
            {"_id": conversation_id}, {"$set": {"summary": summary, "summarized_at_count": conv["message_count"]}})
