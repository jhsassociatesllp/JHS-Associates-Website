import hashlib
import hmac
from datetime import datetime, timedelta, timezone

from app.auth.security import SECRET_KEY
from app.database.connection import get_database
from app.schemas.cookie_consent import POLICY_VERSION, RETENTION_DAYS, ConsentSubmit

COLLECTION = "cookie_consents"
HISTORY_LIMIT = 20

_index_ready = False


def hash_ip(ip: str) -> str:
    """Keyed hash: lets us rate-limit / spot abuse without storing the visitor's IP."""
    return hmac.new(str(SECRET_KEY).encode(), ip.encode(), hashlib.sha256).hexdigest()


def parse_user_agent(ua: str) -> dict:
    """Coarse browser / device class only — the raw user-agent string is never stored."""
    u = (ua or "").lower()
    if "edg/" in u or "edge/" in u:
        browser = "Edge"
    elif "opr/" in u or "opera" in u:
        browser = "Opera"
    elif "firefox" in u:
        browser = "Firefox"
    elif "chrome" in u or "crios" in u:
        browser = "Chrome"
    elif "safari" in u:
        browser = "Safari"
    else:
        browser = "Other"
    if "ipad" in u or "tablet" in u:
        device = "Tablet"
    elif "mobi" in u or "android" in u or "iphone" in u:
        device = "Mobile"
    else:
        device = "Desktop"
    return {"browser": browser, "device": device}


async def _ensure_indexes() -> None:
    global _index_ready
    if _index_ready:
        return
    col = get_database()[COLLECTION]
    await col.create_index("visitor_id", unique=True)
    # Records expire together with the browser cookie (data minimisation).
    await col.create_index("expires_at", expireAfterSeconds=0)
    await col.create_index("updated_at")
    _index_ready = True


async def record_consent(data: ConsentSubmit, ip: str, user_agent: str) -> None:
    await _ensure_indexes()
    now = datetime.now(timezone.utc)
    page = (data.page or "").split("?")[0].split("#")[0][:200] or None
    categories = {"necessary": True, "preferences": data.preferences}
    event = {"status": data.status, "categories": categories, "at": now}
    ua = parse_user_agent(user_agent)

    await get_database()[COLLECTION].update_one(
        {"visitor_id": data.visitor_id.lower()},
        {
            "$set": {
                "status": data.status,
                "categories": categories,
                "policy_version": data.policy_version or POLICY_VERSION,
                "page": page,
                "browser": ua["browser"],
                "device": ua["device"],
                "ip_hash": hash_ip(ip),
                "updated_at": now,
                "expires_at": now + timedelta(days=RETENTION_DAYS),
            },
            "$setOnInsert": {"first_seen": now},
            "$push": {"history": {"$each": [event], "$slice": -HISTORY_LIMIT}},
        },
        upsert=True,
    )


async def summary(days: int = 30) -> dict:
    await _ensure_indexes()
    col = get_database()[COLLECTION]
    since = datetime.now(timezone.utc) - timedelta(days=days)

    totals = {"accepted": 0, "rejected": 0, "custom": 0}
    async for row in col.aggregate([{"$group": {"_id": "$status", "n": {"$sum": 1}}}]):
        if row["_id"] in totals:
            totals[row["_id"]] = row["n"]
    total = sum(totals.values())
    preferences_on = await col.count_documents({"categories.preferences": True})
    events = 0
    async for row in col.aggregate([{"$project": {"n": {"$size": {"$ifNull": ["$history", []]}}}},
                                     {"$group": {"_id": None, "n": {"$sum": "$n"}}}]):
        events = row["n"]

    daily: dict[str, dict] = {}
    pipeline = [
        {"$unwind": "$history"},
        {"$match": {"history.at": {"$gte": since}}},
        {"$group": {
            "_id": {"d": {"$dateToString": {"format": "%Y-%m-%d", "date": "$history.at"}}, "s": "$history.status"},
            "n": {"$sum": 1},
        }},
    ]
    async for row in col.aggregate(pipeline):
        d = daily.setdefault(row["_id"]["d"], {"accepted": 0, "rejected": 0, "custom": 0})
        d[row["_id"]["s"]] = row["n"]
    series = []
    for i in range(days - 1, -1, -1):
        day = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        series.append({"date": day, **daily.get(day, {"accepted": 0, "rejected": 0, "custom": 0})})

    return {
        "total": total,
        **totals,
        "preferences_on": preferences_on,
        "events": events,
        "acceptance_rate": round((totals["accepted"] + totals["custom"]) / total * 100, 1) if total else 0,
        "retention_days": RETENTION_DAYS,
        "policy_version": POLICY_VERSION,
        "daily": series,
    }


async def list_records(status: str | None, skip: int, limit: int) -> dict:
    await _ensure_indexes()
    col = get_database()[COLLECTION]
    query = {"status": status} if status in ("accepted", "rejected", "custom") else {}
    total = await col.count_documents(query)
    rows = []
    async for d in col.find(query).sort("updated_at", -1).skip(skip).limit(limit):
        rows.append({
            "id": d["visitor_id"][:8],  # short, non-identifying reference
            "status": d["status"],
            "preferences": bool(d.get("categories", {}).get("preferences")),
            "browser": d.get("browser", "Other"),
            "device": d.get("device", "Desktop"),
            "page": d.get("page"),
            "policy_version": d.get("policy_version"),
            "changes": len(d.get("history", [])),
            "first_seen": d.get("first_seen"),
            "updated_at": d.get("updated_at"),
            "expires_at": d.get("expires_at"),
        })
    return {"total": total, "items": rows}


def csv_safe(value) -> str:
    """Neutralise spreadsheet formula injection in exported cells."""
    text = "" if value is None else str(value)
    return "'" + text if text[:1] in ("=", "+", "-", "@") else text


async def export_rows() -> list[dict]:
    await _ensure_indexes()
    out = []
    async for d in get_database()[COLLECTION].find({}).sort("updated_at", -1):
        out.append(d)
    return out
