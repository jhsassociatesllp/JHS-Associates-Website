"""Streams a grounded answer and hides the trailing [[USED: ...]] bookkeeping marker from the visitor."""
from typing import AsyncIterator, Dict, List

from app.core.config import Settings
from app.llm.openai_client import LLM
from app.llm.prompt_manager import ANSWER_SYSTEM, USER_TEMPLATE


class MarkerFilter:
    """Forwards text but withholds anything from the first '[[' onward (the marker is stripped later)."""

    def __init__(self):
        self.buf = ""
        self.blocked = False

    def feed(self, piece: str) -> str:
        if self.blocked:
            return ""
        self.buf += piece
        i = self.buf.find("[[")
        if i != -1:
            out, self.buf, self.blocked = self.buf[:i], "", True
            return out
        # keep a possible partial "[" at the very end until we know what follows
        if self.buf.endswith("["):
            out, self.buf = self.buf[:-1], "["
            return out
        out, self.buf = self.buf, ""
        return out

    def flush(self) -> str:
        out = "" if self.blocked else self.buf
        self.buf = ""
        return out


async def stream_answer(
    settings: Settings, llm: LLM, *, question: str, original: str, context: str, history: List[Dict[str, str]],
) -> AsyncIterator[tuple[str, str]]:
    """Yields ('delta', visible_text) while generating, then ('raw', full_raw_text) once at the end."""
    messages = [{"role": "system", "content": ANSWER_SYSTEM}]
    for m in history[-settings.history_window_messages:]:
        messages.append({"role": "assistant" if m["role"] in ("bot", "assistant") else "user", "content": m["text"][:700]})
    messages.append({"role": "user", "content": USER_TEMPLATE.format(question=question, original=original, context=context)})
    flt, raw = MarkerFilter(), []
    async for piece in llm.chat_stream(messages, model=settings.chat_model, temperature=settings.answer_temperature,
                                       max_tokens=settings.answer_max_tokens):
        raw.append(piece)
        vis = flt.feed(piece)
        if vis:
            yield "delta", vis
    tail = flt.flush()
    if tail:
        yield "delta", tail
    yield "raw", "".join(raw)
