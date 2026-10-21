"""Brute-force protection for logins (stored in MongoDB so it works across restarts / workers)."""
import logging
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException

from app.database.connection import get_database

logger = logging.getLogger(__name__)

WINDOW = timedelta(minutes=15)
MAX_FAILS = 5
MAX_FAILS_PER_IP = 20
_index_ready = False


async def check_login_allowed(keys: list[tuple[str, int]]) -> None:
    """keys: [(key, max_failures)]. Raises 429 when any key has too many recent failures.
    A database hiccup never blocks a legitimate login (fail open, but logged)."""
    try:
        db = get_database()
        since = datetime.now(timezone.utc) - WINDOW
        for key, limit in keys:
            if await db.login_failures.count_documents({"key": key, "at": {"$gte": since}}) >= limit:
                raise HTTPException(429, "Too many attempts. Please try again in 15 minutes.")
    except HTTPException:
        raise
    except Exception:
        logger.exception("login throttle check failed (allowing the attempt)")


async def record_failure(keys: list[str]) -> None:
    global _index_ready
    try:
        db = get_database()
        if not _index_ready:
            await db.login_failures.create_index("at", expireAfterSeconds=3600)
            _index_ready = True
        now = datetime.now(timezone.utc)
        await db.login_failures.insert_many([{"key": k, "at": now} for k in keys])
    except Exception:
        logger.exception("could not record a failed login")


async def clear_failures(key: str) -> None:
    try:
        await get_database().login_failures.delete_many({"key": key})
    except Exception:
        pass
