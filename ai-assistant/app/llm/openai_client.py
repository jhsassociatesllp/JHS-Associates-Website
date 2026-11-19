"""OpenAI access: embeddings, chat, structured JSON and streaming, with retry/backoff."""
import json
from typing import Any, AsyncIterator, Dict, List, Optional

import openai
from openai import AsyncOpenAI
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.core.config import Settings
from app.core.exceptions import UpstreamError
from app.core.logging import get_logger

log = get_logger("openai")

EMBED_BATCH = 96
_RETRYABLE = (openai.RateLimitError, openai.APIConnectionError, openai.APITimeoutError, openai.InternalServerError)
_retry = retry(
    retry=retry_if_exception_type(_RETRYABLE),
    stop=stop_after_attempt(4),
    wait=wait_exponential(multiplier=1, min=1, max=12),
    reraise=True,
)


def _takes_temperature(model: str) -> bool:
    # Reasoning-family models only accept the default temperature.
    return not model.startswith(("gpt-5", "o1", "o3", "o4"))


class LLM:
    def __init__(self, settings: Settings, client: Optional[AsyncOpenAI] = None):
        self.s = settings
        self.client = client or AsyncOpenAI(
            api_key=settings.openai_api_key, timeout=settings.openai_timeout_seconds, max_retries=0
        )
        self.usage: Dict[str, int] = {"prompt_tokens": 0, "completion_tokens": 0, "embedding_tokens": 0}

    # ---- embeddings ----
    @_retry
    async def _embed_batch(self, batch: List[str]) -> List[List[float]]:
        res = await self.client.embeddings.create(
            model=self.s.embedding_model, input=batch, dimensions=self.s.embedding_dimensions
        )
        if res.usage:
            self.usage["embedding_tokens"] += res.usage.total_tokens
        return [d.embedding for d in res.data]

    async def embed(self, texts: List[str]) -> List[List[float]]:
        out: List[List[float]] = []
        try:
            for i in range(0, len(texts), EMBED_BATCH):
                out.extend(await self._embed_batch([t or " " for t in texts[i:i + EMBED_BATCH]]))
        except openai.OpenAIError as e:
            raise UpstreamError(f"embedding failed: {type(e).__name__}") from e
        return out

    async def embed_one(self, text: str) -> List[float]:
        return (await self.embed([text]))[0]

    # ---- chat ----
    def _kwargs(self, model: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        kw: Dict[str, Any] = {"model": model, "max_completion_tokens": max_tokens}
        if _takes_temperature(model):
            kw["temperature"] = temperature
        return kw

    @_retry
    async def chat(
        self, messages: List[Dict[str, str]], *, model: Optional[str] = None, temperature: float = 0.2,
        max_tokens: int = 700, json_schema: Optional[Dict[str, Any]] = None,
    ) -> str:
        model = model or self.s.chat_model
        kw = self._kwargs(model, temperature, max_tokens)
        if json_schema:
            kw["response_format"] = {
                "type": "json_schema",
                "json_schema": {"name": "result", "schema": json_schema, "strict": True},
            }
        try:
            res = await self.client.chat.completions.create(messages=messages, **kw)
        except openai.OpenAIError as e:
            if isinstance(e, _RETRYABLE):
                raise
            raise UpstreamError(f"chat failed: {type(e).__name__}") from e
        if res.usage:
            self.usage["prompt_tokens"] += res.usage.prompt_tokens
            self.usage["completion_tokens"] += res.usage.completion_tokens
        return (res.choices[0].message.content or "").strip()

    async def chat_json(self, messages: List[Dict[str, str]], schema: Dict[str, Any], *, model: Optional[str] = None,
                        max_tokens: int = 500) -> Dict[str, Any]:
        raw = await self.chat(messages, model=model or self.s.router_model, temperature=0, max_tokens=max_tokens,
                              json_schema=schema)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise UpstreamError("model returned invalid JSON") from e

    async def chat_stream(
        self, messages: List[Dict[str, str]], *, model: Optional[str] = None, temperature: float = 0.2,
        max_tokens: int = 700,
    ) -> AsyncIterator[str]:
        model = model or self.s.chat_model
        kw = self._kwargs(model, temperature, max_tokens)
        try:
            stream = await self.client.chat.completions.create(messages=messages, stream=True, **kw)
            async for event in stream:
                if event.choices and event.choices[0].delta and event.choices[0].delta.content:
                    yield event.choices[0].delta.content
        except openai.OpenAIError as e:
            raise UpstreamError(f"stream failed: {type(e).__name__}") from e
