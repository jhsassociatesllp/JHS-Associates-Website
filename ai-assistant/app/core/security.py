"""Admin auth, rate limiting and input hygiene."""
import hmac
import re
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from fastapi import Header, Request

from app.core.config import Settings, get_settings
from app.core.exceptions import AccessDenied, AppError, RateLimited


class _Unavailable(AppError):
    status_code = 503
    code = "admin_disabled"
    public_message = "Administration is not configured."


async def require_admin(x_api_key: str = Header(default="", alias="X-API-Key")) -> None:
    """Protects every admin/webhook endpoint. Fails CLOSED when no key is configured."""
    configured = get_settings().admin_api_key
    if not configured:
        raise _Unavailable("ADMIN_API_KEY not set")
    if not x_api_key or not hmac.compare_digest(x_api_key.encode(), configured.encode()):
        raise AccessDenied("bad admin key", public_message="Unauthorized.")


class SlidingWindowLimiter:
    """Simple in-process limiter (per client key). Edge limiting stays in nginx; this is defence in depth."""

    def __init__(self, limit: int, window_seconds: int = 60):
        self.limit, self.window = limit, window_seconds
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    def check(self, key: str) -> None:
        now = time.monotonic()
        q = self._hits[key]
        while q and now - q[0] > self.window:
            q.popleft()
        if len(q) >= self.limit:
            raise RateLimited()
        q.append(now)


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for", "")
    return (fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "unknown")) or "unknown"


_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def clean_user_text(text: str, settings: Settings | None = None) -> str:
    """Strip control characters, collapse whitespace and cap length. Does NOT try to 'detect' injection here;
    injection resistance comes from treating all retrieved/user text as data (see prompt_manager)."""
    settings = settings or get_settings()
    text = _CONTROL.sub(" ", text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text[: settings.max_message_chars]


_URL = re.compile(r"https?://[^\s)\]>\"']+")


def strip_unknown_urls(text: str, allowed: set[str]) -> str:
    """Remove any URL the model produced that is not one of the retrieved sources' real URLs."""
    def _sub(m: re.Match) -> str:
        url = m.group(0).rstrip(".,;")
        return m.group(0) if url in allowed else ""
    return _URL.sub(_sub, text)
