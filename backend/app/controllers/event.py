import re
from datetime import datetime, timedelta, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError

from app.controllers.cookie_consent import hash_ip
from app.database.connection import get_database
from app.schemas.event import EventCreate, EventUpdate, RegistrationCreate

EVENTS = "events"
REGISTRATIONS = "event_registrations"
DEFAULT_LENGTH = timedelta(hours=2)

_indexes_ready = False


class RegistrationError(Exception):
    """Business-rule failure with an HTTP status for the route to use."""

    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


def _oid(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise ValueError("Invalid id")


def _utc(dt: Optional[datetime]) -> Optional[datetime]:
    """Mongo returns naive UTC datetimes; make them explicit so JSON carries the 'Z'."""
    if dt is None:
        return None
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)


def _to_storage(dt: Optional[datetime]) -> Optional[datetime]:
    return None if dt is None else (dt.astimezone(timezone.utc) if dt.tzinfo else dt.replace(tzinfo=timezone.utc))


async def _ensure_indexes() -> None:
    global _indexes_ready
    if _indexes_ready:
        return
    db = get_database()
    await db[EVENTS].create_index("start_at")
    await db[REGISTRATIONS].create_index([("event_id", 1), ("email", 1)], unique=True)
    await db[REGISTRATIONS].create_index([("event_id", 1), ("created_at", -1)])
    _indexes_ready = True


def _view(doc: dict, admin: bool = False) -> dict:
    now = datetime.now(timezone.utc)
    start = _utc(doc["start_at"])
    end = _utc(doc.get("end_at")) or (start + DEFAULT_LENGTH)
    deadline = _utc(doc.get("registration_deadline"))
    registered = int(doc.get("registered", 0))
    capacity = int(doc.get("capacity", 0))
    state = "upcoming" if now < start else ("live" if now <= end else "past")
    open_until = deadline or end
    is_open = (
        doc.get("status") == "published"
        and not doc.get("external_registration_url")
        and now <= open_until
        and (capacity == 0 or registered < capacity)
    )
    out = {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "event_type": doc.get("event_type", "Other"),
        "summary": doc.get("summary", ""),
        "description": doc.get("description", ""),
        "start_at": start,
        "end_at": end,
        "mode": doc.get("mode", "Online"),
        "venue": doc.get("venue"),
        "external_registration_url": doc.get("external_registration_url"),
        "capacity": capacity,
        "registered": registered,
        "spots_left": max(capacity - registered, 0) if capacity else None,
        "registration_deadline": deadline,
        "host": doc.get("host"),
        "state": state,
        "registration_open": is_open,
    }
    if admin:
        out.update({
            "join_link": doc.get("join_link"),
            "status": doc.get("status", "published"),
            "created_at": _utc(doc.get("created_at")),
            "updated_at": _utc(doc.get("updated_at")),
        })
    return out


# ── Public ──────────────────────────────────────────────────────────────────

async def list_public(past: bool = False, limit: int = 12) -> list[dict]:
    db = get_database()
    # an event is "current" until it ends (default length 2h when no end time is set)
    docs = [d async for d in db[EVENTS].find({"status": {"$in": ["published", "cancelled"]}})]
    result = []
    for d in docs:
        if d.get("status") == "cancelled":
            continue
        v = _view(d)
        if (v["state"] == "past") == past:
            result.append(v)
    result.sort(key=lambda e: e["start_at"], reverse=past)
    return result[:limit]


async def get_public(event_id: str) -> Optional[dict]:
    doc = await get_database()[EVENTS].find_one({"_id": _oid(event_id), "status": "published"})
    return _view(doc) if doc else None


# ── Admin: events ───────────────────────────────────────────────────────────

async def list_admin() -> list[dict]:
    docs = [d async for d in get_database()[EVENTS].find({}).sort("start_at", -1)]
    return [_view(d, admin=True) for d in docs]


async def create_event(data: EventCreate) -> dict:
    await _ensure_indexes()
    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    for key in ("start_at", "end_at", "registration_deadline"):
        payload[key] = _to_storage(payload.get(key))
    payload.update({"registered": 0, "created_at": now, "updated_at": now})
    result = await get_database()[EVENTS].insert_one(payload)
    return _view(await get_database()[EVENTS].find_one({"_id": result.inserted_id}), admin=True)


async def update_event(event_id: str, data: EventUpdate) -> Optional[dict]:
    db = get_database()
    patch = data.model_dump(exclude_unset=True)
    for key in ("start_at", "end_at", "registration_deadline"):
        if key in patch:
            patch[key] = _to_storage(patch[key])
    patch["updated_at"] = datetime.now(timezone.utc)
    result = await db[EVENTS].update_one({"_id": _oid(event_id)}, {"$set": patch})
    if result.matched_count == 0:
        return None
    return _view(await db[EVENTS].find_one({"_id": _oid(event_id)}), admin=True)


async def delete_event(event_id: str) -> bool:
    db = get_database()
    oid = _oid(event_id)
    result = await db[EVENTS].delete_one({"_id": oid})
    if result.deleted_count:
        await db[REGISTRATIONS].delete_many({"event_id": event_id})
    return result.deleted_count == 1


async def summary() -> dict:
    db = get_database()
    events = [d async for d in db[EVENTS].find({})]
    views = [_view(d) for d in events]
    since = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=7)
    return {
        "events": len(events),
        "upcoming": sum(1 for v in views if v["state"] != "past"),
        "registrations": await db[REGISTRATIONS].count_documents({}),
        "last_7_days": await db[REGISTRATIONS].count_documents({"created_at": {"$gte": since}}),
    }


# ── Registration (public) ───────────────────────────────────────────────────

async def register(event_id: str, data: RegistrationCreate, ip: str) -> tuple[dict, dict, str]:
    """Returns (event_view, event_doc, reference). Raises RegistrationError."""
    await _ensure_indexes()
    db = get_database()
    oid = _oid(event_id)
    doc = await db[EVENTS].find_one({"_id": oid, "status": "published"})
    if not doc:
        raise RegistrationError(404, "Event not found")
    if doc.get("external_registration_url"):
        raise RegistrationError(400, "Registration for this event happens on its own registration page")
    view = _view(doc)
    if view["state"] == "past":
        raise RegistrationError(410, "This event has already taken place")
    if not view["registration_open"]:
        if view["capacity"] and view["registered"] >= view["capacity"]:
            raise RegistrationError(409, "Sorry, this event is full")
        raise RegistrationError(410, "Registration for this event is closed")

    # Reserve a seat atomically (never over-fills, even with simultaneous sign-ups)
    reserve = {"_id": oid}
    if view["capacity"]:
        reserve["registered"] = {"$lt": view["capacity"]}
    reserved = await db[EVENTS].update_one(reserve, {"$inc": {"registered": 1}})
    if reserved.matched_count == 0:
        raise RegistrationError(409, "Sorry, this event is full")

    now = datetime.now(timezone.utc)
    record = {
        "event_id": event_id,
        "name": data.name,
        "email": str(data.email).lower(),
        "phone": re.sub(r"\s+", " ", data.phone).strip(),
        "organization": data.organization,
        "designation": data.designation,
        "city": data.city,
        "attended": False,
        "consent": True,
        "ip_hash": hash_ip(ip),
        "created_at": now,
    }
    try:
        inserted = await db[REGISTRATIONS].insert_one(record)
    except DuplicateKeyError:
        await db[EVENTS].update_one({"_id": oid}, {"$inc": {"registered": -1}})
        raise RegistrationError(409, "This email address is already registered for this event")
    except Exception:
        await db[EVENTS].update_one({"_id": oid}, {"$inc": {"registered": -1}})
        raise

    fresh = await db[EVENTS].find_one({"_id": oid})
    return _view(fresh), fresh, str(inserted.inserted_id)[-8:].upper()


# ── Admin: registrations ────────────────────────────────────────────────────

async def list_registrations(event_id: str, search: Optional[str], skip: int, limit: int) -> dict:
    db = get_database()
    query: dict = {"event_id": event_id}
    if search:
        rx = {"$regex": re.escape(search.strip()), "$options": "i"}
        query["$or"] = [{"name": rx}, {"email": rx}, {"organization": rx}, {"city": rx}]
    total = await db[REGISTRATIONS].count_documents(query)
    items = []
    async for d in db[REGISTRATIONS].find(query).sort("created_at", -1).skip(skip).limit(limit):
        items.append(_reg_view(d))
    return {"total": total, "items": items}


def _reg_view(d: dict) -> dict:
    return {
        "id": str(d["_id"]), "event_id": d["event_id"], "name": d["name"], "email": d["email"], "phone": d["phone"],
        "organization": d.get("organization"), "designation": d.get("designation"), "city": d.get("city"),
        "attended": bool(d.get("attended")), "created_at": _utc(d["created_at"]),
    }


async def all_registrations(event_id: str) -> list[dict]:
    return [d async for d in get_database()[REGISTRATIONS].find({"event_id": event_id}).sort("created_at", 1)]


async def set_attended(registration_id: str, attended: bool) -> Optional[dict]:
    db = get_database()
    res = await db[REGISTRATIONS].find_one_and_update(
        {"_id": _oid(registration_id)}, {"$set": {"attended": attended}}, return_document=True)
    return _reg_view(res) if res else None


async def delete_registration(registration_id: str) -> bool:
    db = get_database()
    doc = await db[REGISTRATIONS].find_one_and_delete({"_id": _oid(registration_id)})
    if doc:
        await db[EVENTS].update_one({"_id": _oid(doc["event_id"])}, {"$inc": {"registered": -1}})
    return bool(doc)
