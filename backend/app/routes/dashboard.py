"""Live numbers for the admin Dashboard: content counts, form submissions, trends and recent activity.

Content figures (articles, regulatory, reg-watch ...) go to Super Admin and content admins; submission figures
(contacts, proposals, applications ...) go to Super Admin and HR Admin. Each role only receives what it may see.
"""
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends

from app.auth.deps import get_current_admin
from app.database.connection import get_database
from app.schemas.admin import AdminInDB, AdminRole
from app.utils.timestamps import IST

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# key -> (collection, label, admin path, how to write its recent-activity line)
CONTENT = {
    "articles": ("Articles", "Articles", "/articles"),
    "blogs": ("Blogs", "Blogs", "/blogs"),
    "knowledge": ("Knowledge", "Knowledge Resources", "/knowledge"),
    "white_papers": ("WhitePaper", "White Papers", "/white-papers"),
    "regulatory": ("Regulatory", "Regulatory", "/regulatory"),
    "reg_watch": ("reg_watch", "Reg-Watch", "/reg-watch"),
    "excellencia": ("Excellencia", "Excellencia", "/excellencia"),
    "newsletters": ("Newsletter", "Newsletters", "/newsletters"),
    "podcasts": ("podcasts", "Podcasts", "/podcasts"),
}
SUBMISSIONS = {
    "contacts": ("contact_us", "Contacts", "/contacts"),
    "proposals": ("proposals", "Proposals", "/proposals"),
    "applications": ("career_applications", "Job applications", "/careers"),
    "appointments": ("appointments", "Appointments", "/appointments"),
    "alumni": ("alumni", "Alumni", "/alumni"),
    "feedback": ("feedback", "Client feedback", "/feedback"),
    "users": ("users", "Site accounts", "/users"),
    "event_registrations": ("event_registrations", "Event registrations", "/events"),
}
# which submissions have a "waiting for us" state, and how to find those documents
NEEDS_ATTENTION = {
    "proposals": {"$or": [{"status": "new"}, {"status": {"$exists": False}}]},
    "applications": {"status": "new"},
    "appointments": {"status": "new"},
}

CONTENT_ROLES = {AdminRole.SUPER_ADMIN, AdminRole.ADMIN}
SUBMISSION_ROLES = {AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN}

# when a document has no created_at (older content), fall back to the time stored inside its _id
_WHEN = {"$convert": {"input": {"$ifNull": ["$created_at", {"$toDate": "$_id"}]}, "to": "date", "onError": {"$toDate": "$_id"}}}


def _utc(dt: datetime) -> datetime:
    return dt.astimezone(timezone.utc)


def _windows(now: Optional[datetime] = None) -> dict:
    """UTC instants for "today", "last 7 days", "this month", the last 7 Indian days and the last 12 Indian months."""
    now = (now or datetime.now(timezone.utc)).astimezone(IST)
    day0 = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month0 = day0.replace(day=1)
    months = []
    y, m = month0.year, month0.month
    for _ in range(12):
        months.append((y, m))
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    months.reverse()
    first_of = datetime(months[0][0], months[0][1], 1, tzinfo=IST)
    return {
        "today": _utc(day0), "week": _utc(day0 - timedelta(days=6)), "month": _utc(month0),
        "days": [(day0 - timedelta(days=n)).strftime("%Y-%m-%d") for n in range(6, -1, -1)],
        "months": [f"{y}-{mo:02d}" for y, mo in months], "first_month": _utc(first_of),
    }


async def _facet(collection: str, w: dict, attention: Optional[dict]) -> dict:
    """Everything one collection needs in a single database round-trip."""
    def counted(match: Optional[dict] = None):
        return ([{"$match": match}] if match else []) + [{"$count": "n"}]

    def grouped(since: datetime, fmt: str):
        return [{"$match": {"_t": {"$gte": since}}},
                {"$group": {"_id": {"$dateToString": {"format": fmt, "date": "$_t", "timezone": "Asia/Kolkata"}}, "n": {"$sum": 1}}}]

    facets = {
        "total": counted(),
        "today": counted({"_t": {"$gte": w["today"]}}),
        "week": counted({"_t": {"$gte": w["week"]}}),
        "month": counted({"_t": {"$gte": w["month"]}}),
        "by_day": grouped(w["week"], "%Y-%m-%d"),
        "by_month": grouped(w["first_month"], "%Y-%m"),
    }
    if attention:
        facets["attention"] = counted(attention)
    rows = await get_database()[collection].aggregate([{"$addFields": {"_t": _WHEN}}, {"$facet": facets}]).to_list(1)
    return rows[0] if rows else {}


def _n(block: list) -> int:
    return int(block[0]["n"]) if block else 0


def _shape(facet: dict, w: dict) -> dict:
    out = {
        "total": _n(facet.get("total", [])), "today": _n(facet.get("today", [])),
        "week": _n(facet.get("week", [])), "month": _n(facet.get("month", [])),
        "by_day": {r["_id"]: r["n"] for r in facet.get("by_day", [])},
        "by_month": {r["_id"]: r["n"] for r in facet.get("by_month", [])},
    }
    if "attention" in facet:
        out["attention"] = _n(facet["attention"])
    return out


def _when(doc: dict) -> Optional[datetime]:
    t = doc.get("created_at")
    if isinstance(t, datetime):
        return t if t.tzinfo else t.replace(tzinfo=timezone.utc)
    oid = doc.get("_id")
    return getattr(oid, "generation_time", None)


def _line(kind: str, doc: dict) -> tuple[str, str]:
    """(headline, small print) for the recent-activity list."""
    g = doc.get
    full = lambda a, b: f"{g(a, '') or ''} {g(b, '') or ''}".strip()   # noqa: E731
    if kind == "contacts":
        return f"New inquiry from {g('name', 'a visitor')}", g("service") or g("company") or ""
    if kind == "proposals":
        return f"Proposal request: {g('subject', '')}", full("first_name", "last_name")
    if kind == "applications":
        return f"Job application: {g('full_name', '')}", g("job_title") or "General application"
    if kind == "appointments":
        return f"Appointment request: {g('full_name', '') or g('name', '')}", g("speciality") or ""
    if kind == "alumni":
        return f"Alumni registration: {full('first_name', 'last_name')}", g("company") or ""
    if kind == "feedback":
        return f"Client feedback: {g('client_name', '')}", g("name") or ""
    if kind == "users":
        return f"New site account: {g('name', '')}", "Google" if g("auth_provider") == "google" else "Email & password"
    if kind == "event_registrations":
        return f"Event registration: {g('name', '')}", g("organization") or ""
    return f"{CONTENT.get(kind, ('', kind))[1]}: {g('title', '') or g('name', '')}", g("author") or ""


async def _recent(kind: str, collection: str, limit: int = 6) -> list[dict]:
    cursor = get_database()[collection].find({}).sort("_id", -1).limit(limit)
    items = []
    async for doc in cursor:
        at = _when(doc)
        title, sub = _line(kind, doc)
        items.append({"type": kind, "title": title.strip(" :"), "subtitle": sub, "at": at})
    return items


def _iso(dt: Optional[datetime]) -> Optional[str]:
    return _utc(dt).strftime("%Y-%m-%dT%H:%M:%SZ") if dt else None


@router.get("/stats")
async def dashboard_stats(current_admin: AdminInDB = Depends(get_current_admin)):
    w = _windows()
    sees_content = current_admin.role in CONTENT_ROLES
    sees_submissions = current_admin.role in SUBMISSION_ROLES

    wanted: dict[str, tuple[str, str, str, Optional[dict]]] = {}
    if sees_content:
        wanted.update({k: (*v, None) for k, v in CONTENT.items()})
    if sees_submissions:
        wanted.update({k: (*v, NEEDS_ATTENTION.get(k)) for k, v in SUBMISSIONS.items()})

    async def one(kind: str):
        collection, _label, _path, attention = wanted[kind]
        try:
            return kind, _shape(await _facet(collection, w, attention), w)
        except Exception:   # one slow or missing collection must not blank the whole dashboard
            return kind, {"total": 0, "today": 0, "week": 0, "month": 0, "by_day": {}, "by_month": {}}

    async def recent(kind: str):
        try:
            return await _recent(kind, wanted[kind][0])
        except Exception:
            return []

    shaped, recents = await asyncio.gather(
        asyncio.gather(*(one(k) for k in wanted)),
        asyncio.gather(*(recent(k) for k in wanted)),
    )
    data = dict(shaped)

    def block(source: dict, meta: dict) -> dict:
        return {k: {"label": meta[k][1], "path": meta[k][2], **{f: v for f, v in data[k].items() if f not in ("by_day", "by_month")}}
                for k in source}

    def series(keys: list[str]) -> dict:
        week = [{"label": datetime.strptime(d, "%Y-%m-%d").strftime("%a"), "date": d, **{k: data[k]["by_day"].get(d, 0) for k in keys}} for d in w["days"]]
        year = [{"label": datetime.strptime(m + "-01", "%Y-%m-%d").strftime("%b"), "month": m, **{k: data[k]["by_month"].get(m, 0) for k in keys}} for m in w["months"]]
        return {"week": week, "month": year[-6:], "year": year}

    feed = sorted((item for group in recents for item in group), key=lambda i: i["at"] or datetime.min.replace(tzinfo=timezone.utc), reverse=True)[:14]
    all_meta = {**CONTENT, **SUBMISSIONS}
    return {
        "generated_at": _iso(datetime.now(timezone.utc)),
        "role": current_admin.role.value if hasattr(current_admin.role, "value") else str(current_admin.role),
        "content": block({k: 1 for k in CONTENT if k in data}, CONTENT) if sees_content else None,
        "submissions": block({k: 1 for k in SUBMISSIONS if k in data}, SUBMISSIONS) if sees_submissions else None,
        "content_series": series([k for k in CONTENT if k in data]) if sees_content else None,
        "submission_series": series([k for k in SUBMISSIONS if k in data]) if sees_submissions else None,
        "recent": [{"type": i["type"], "title": i["title"], "subtitle": i["subtitle"], "at": _iso(i["at"]), "path": all_meta[i["type"]][2]} for i in feed],
    }
