"""Client IP and a small in-process rate limiter shared by the public routes."""
import ipaddress
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


def _public(ip: str) -> bool:
    try:
        a = ipaddress.ip_address(ip)
    except ValueError:
        return False
    return not (a.is_private or a.is_loopback or a.is_link_local or a.is_reserved or a.is_unspecified)


def client_ip(request: Request) -> str:
    """Best estimate of the visitor's IP behind our own proxies, hard to spoof.

    X-Forwarded-For is built left-to-right: whatever the visitor sends comes first and every
    proxy appends the address it saw. So the visitor cannot control the RIGHT-most public
    entry, which is what the first proxy outside our private network recorded. (Behind
    Cloudflare that entry would be Cloudflare's own address - use CF-Connecting-IP there.)
    """
    forwarded = request.headers.get("x-forwarded-for", "")
    for part in reversed([p.strip() for p in forwarded.split(",") if p.strip()]):
        if _public(part):
            return part[:64]
    real = (request.headers.get("x-real-ip") or "").strip()
    if _public(real):
        return real[:64]
    return request.client.host if request.client else "unknown"


_hits: dict[str, deque] = defaultdict(deque)


def throttle(key: str, window_seconds: int, limit: int,
             detail: str = "Too many attempts. Please try again in a little while.") -> None:
    """Allow at most `limit` calls per `window_seconds` for `key`; otherwise raise 429."""
    now = time.monotonic()
    q = _hits[key]
    while q and now - q[0] > window_seconds:
        q.popleft()
    if len(q) >= limit:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, detail)
    q.append(now)
    if len(_hits) > 10000:
        for k in [k for k, v in _hits.items() if not v][:2000]:
            _hits.pop(k, None)
