"""Rate limiting for the whole API, with the admin panel in mind.

Four limits, all counted per minute or per five minutes and kept in memory:
  1. per visitor IP        any /api/ call (a very high ceiling that only a script or a flood ever reaches)
  2. per admin account     every call made with an admin login (keyed by the account, so two admins in one office do not share a budget)
  3. per admin account     changes only (POST / PUT / PATCH / DELETE), a tighter limit
  4. per admin account     Excel / ZIP downloads (heavy and full of client data), tighter still
  5. per visitor IP        repeated refused requests (401 / 403): someone guessing tokens or probing routes is shut out for a while

When a limit is passed the API answers 429 "Too Many Requests" with a Retry-After header. The numbers can be tuned with
environment variables (RATE_LIMIT_*), see app/config/settings.py.
"""
import re
import time
from collections import defaultdict, deque
from typing import Optional

import jwt

from app.auth.security import ALGORITHM, SECRET_KEY
from app.config.settings import settings

# read at start-up; the tests change these directly
LIMITS = {
    "enabled": settings.rate_limit_enabled,
    "ip_per_min": settings.rate_limit_ip_per_min,
    "admin_per_min": settings.rate_limit_admin_per_min,
    "admin_write_per_min": settings.rate_limit_admin_write_per_min,
    "export_per_5min": settings.rate_limit_export_per_5min,
    "refused_per_5min": settings.rate_limit_refused_per_5min,
}

WRITE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
EXPORT_PATH = re.compile(r"^/api/(export/|proposal/export|careers/admin/applications/export)")

_hits: dict[str, deque] = defaultdict(deque)
_MAX_KEYS = 20000


def _count(key: str, window: float, now: float) -> int:
    q = _hits[key]
    while q and now - q[0] > window:
        q.popleft()
    return len(q)


def _retry_after(key: str, window: float, now: float) -> int:
    q = _hits[key]
    return max(1, int(window - (now - q[0])) + 1) if q else 1


def admin_account(authorization: str) -> Optional[str]:
    """The admin account a Bearer token belongs to (signature and expiry checked), or None."""
    if not authorization.lower().startswith("bearer "):
        return None
    try:
        payload = jwt.decode(authorization[7:].strip(), SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None
    return str(payload.get("sub")).lower() if payload.get("type") == "admin" and payload.get("sub") else None


def check(method: str, path: str, ip: str, authorization: str = "", now: Optional[float] = None) -> Optional[int]:
    """Counts this request. Returns None when it may go ahead, or the number of seconds to wait."""
    if not LIMITS["enabled"] or method == "OPTIONS" or not path.startswith("/api/"):
        return None
    now = time.monotonic() if now is None else now
    admin = admin_account(authorization) if authorization else None

    # shut out an address that keeps being refused (token guessing, route probing)
    key = f"refused:{ip}"
    if _count(key, 300, now) >= LIMITS["refused_per_5min"]:
        return _retry_after(key, 300, now)

    rules = [(f"ip:{ip}", 60, LIMITS["ip_per_min"])]
    if admin:
        rules.append((f"admin:{admin}", 60, LIMITS["admin_per_min"]))
        if method in WRITE_METHODS:
            rules.append((f"adminw:{admin}", 60, LIMITS["admin_write_per_min"]))
    if EXPORT_PATH.match(path):
        rules.append((f"export:{admin or ip}", 300, LIMITS["export_per_5min"]))

    for k, window, limit in rules:   # check all first, so a refused request is not counted against the others
        if _count(k, window, now) >= limit:
            return _retry_after(k, window, now)
    for k, _, _ in rules:
        _hits[k].append(now)
    if len(_hits) > _MAX_KEYS:
        for stale in [k for k, v in _hits.items() if not v or now - v[-1] > 600][:5000]:
            _hits.pop(stale, None)
    return None


def note_refused(path: str, status_code: int, ip: str, now: Optional[float] = None) -> None:
    """Call after the answer is known: a 401 / 403 counts towards the "keeps being refused" limit."""
    if LIMITS["enabled"] and path.startswith("/api/") and status_code in (401, 403):
        _hits[f"refused:{ip}"].append(time.monotonic() if now is None else now)


def reset() -> None:
    _hits.clear()
