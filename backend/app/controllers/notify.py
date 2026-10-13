"""'New insight' emails to signed-in (Google-verified) website users.

Flow
  admin publishes content -> queue_content() creates a job that is *scheduled* a few minutes
  ahead (a cancel window) -> a background worker claims due jobs and sends one email per
  recipient at a gentle pace -> progress is stored on the job so a restart resumes where it
  stopped. Every email carries a signed one-click unsubscribe link.

Safeguards
  * only verified accounts (signed in with Google) who have not unsubscribed;
  * one job per piece of content (no duplicates), admin can switch the feature off or cancel;
  * every user-supplied value is HTML-escaped; links are built from a fixed site address;
  * the unsubscribe token is an HMAC of the account id (cannot be guessed or forged).
"""
import asyncio
import hashlib
import hmac
import logging
from datetime import datetime, timedelta, timezone
from html import escape as esc
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from app.auth.security import SECRET_KEY
from app.config.settings import settings
from app.database.connection import get_database
from app.services import email_service

logger = logging.getLogger("notify")

JOBS = "notify_jobs"
SETTINGS = "notify_settings"
USERS = "users"

SEND_GAP_SECONDS = 3          # ~20 emails a minute: well inside Microsoft 365 sending limits
POLL_SECONDS = 20
LEASE = timedelta(minutes=10)
DEFAULT_SETTINGS = {"enabled": True, "delay_minutes": 10}

# What each content type is called in the email and which public page lists it.
KINDS = {
    "white_paper": ("White Paper", "/white-papers"),
    "article": ("Article", "/articles"),
    "newsletter": ("Newsletter", "/newsletters"),
    "regulatory": ("Regulatory Update", "/regulatory"),
    "reg_watch": ("Reg-Watch Update", "/reg-watch"),
    "knowledge": ("Knowledge Resource", "/resources"),
    "excellencia": ("Excellencia", "/excellencia"),
    "podcast": ("Podcast Episode", "/podcasts"),
}


class NotifyError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


# ── unsubscribe tokens ──────────────────────────────────────────────────────

def _sig(uid: str) -> str:
    key = (settings.ip_hash_salt or SECRET_KEY or "").encode() + b"|unsubscribe"
    return hmac.new(key, uid.encode(), hashlib.sha256).hexdigest()[:32]


def make_token(uid: str) -> str:
    return f"{uid}.{_sig(uid)}"


def read_token(token: str) -> Optional[str]:
    """Returns the account id if the token is genuine, otherwise None."""
    try:
        uid, sig = (token or "").split(".", 1)
        ObjectId(uid)
    except (ValueError, InvalidId):
        return None
    return uid if hmac.compare_digest(sig, _sig(uid)) else None


def unsubscribe_url(uid: str) -> str:
    return f"{settings.site_url.rstrip('/')}/unsubscribe?token={make_token(uid)}"


# ── settings & recipients ───────────────────────────────────────────────────

async def get_settings() -> dict:
    doc = await get_database()[SETTINGS].find_one({"_id": "main"}) or {}
    return {"enabled": bool(doc.get("enabled", DEFAULT_SETTINGS["enabled"])),
            "delay_minutes": int(doc.get("delay_minutes", DEFAULT_SETTINGS["delay_minutes"]))}


async def update_settings(enabled: bool, delay_minutes: int) -> dict:
    if not 0 <= delay_minutes <= 1440:
        raise NotifyError(422, "Delay must be between 0 and 1440 minutes")
    await get_database()[SETTINGS].update_one(
        {"_id": "main"}, {"$set": {"enabled": bool(enabled), "delay_minutes": int(delay_minutes)}}, upsert=True)
    return await get_settings()


def recipients_filter() -> dict:
    """Verified accounts that have not opted out and are not suspended."""
    return {"is_verified": True, "notify_new_insights": {"$ne": False},
            "status": {"$in": ["active", None]}, "email": {"$exists": True, "$ne": ""}}


async def stats() -> dict:
    db = get_database()
    return {
        "subscribers": await db[USERS].count_documents(recipients_filter()),
        "unsubscribed": await db[USERS].count_documents({"notify_new_insights": False}),
        "verified_accounts": await db[USERS].count_documents({"is_verified": True}),
    }


async def set_subscription(uid: str, on: bool) -> bool:
    res = await get_database()[USERS].update_one(
        {"_id": ObjectId(uid)},
        {"$set": {"notify_new_insights": on, "notify_changed_at": datetime.now(timezone.utc)}})
    return res.matched_count == 1


# ── queueing ────────────────────────────────────────────────────────────────

async def queue_content(kind: str, item_id: str, title: str, summary: str) -> Optional[str]:
    """Schedule a notification for a newly published item. Never raises into the caller."""
    try:
        if kind not in KINDS or not item_id or not title:
            return None
        cfg = await get_settings()
        if not cfg["enabled"]:
            return None
        db = get_database()
        await db[JOBS].create_index([("kind", 1), ("item_id", 1)], unique=True)
        now = datetime.now(timezone.utc)
        doc = {
            "kind": kind, "item_id": str(item_id), "title": str(title)[:200], "summary": str(summary or "")[:500],
            "status": "scheduled", "created_at": now, "send_at": now + timedelta(minutes=cfg["delay_minutes"]),
            "sent": 0, "failed": 0, "total": None, "cursor": None, "lease_until": None, "finished_at": None,
        }
        res = await db[JOBS].insert_one(doc)
        logger.info("Queued %s notification '%s' for %s", kind, doc["title"], doc["send_at"])
        return str(res.inserted_id)
    except Exception as exc:  # duplicate key (already queued) or a database hiccup: never block publishing
        logger.info("Notification not queued (%s): %s", kind, type(exc).__name__)
        return None


# ── the email ───────────────────────────────────────────────────────────────

def render_email(kind: str, title: str, summary: str, user_name: str, uid: str) -> tuple[str, str, dict]:
    label, path = KINDS[kind]
    site = settings.site_url.rstrip("/")
    link = f"{site}{path}"
    unsub = unsubscribe_url(uid)
    first = (user_name or "").strip().split(" ")[0] or "there"
    body = f"""
    <tr><td colspan="2" style="padding:6px 0 14px;line-height:1.7;color:#2b3445;">
      Dear <strong>{esc(first)}</strong>,<br><br>
      A new {esc(label.lower())} has just been published on the JHS website:
    </td></tr>
    <tr><td colspan="2" style="padding:0 0 18px;">
      <div style="border-left:4px solid #B01E2E;background:#f6f8fb;padding:16px 18px;border-radius:6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#B01E2E;">{esc(label)}</div>
        <div style="font-size:17px;font-weight:700;color:#0f2340;line-height:1.4;margin:6px 0;">{esc(title)}</div>
        <div style="font-size:14px;color:#44506a;line-height:1.6;">{esc(summary)}</div>
      </div>
    </td></tr>
    <tr><td colspan="2" style="padding:0 0 22px;">
      <a href="{esc(link, quote=True)}" style="display:inline-block;background:#0f2340;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 26px;border-radius:100px;">Read it now</a>
    </td></tr>
    <tr><td colspan="2" style="padding:0;line-height:1.7;color:#2b3445;">
      Warm regards,<br><strong>JHS</strong>
    </td></tr>
    <tr><td colspan="2" style="padding:22px 0 0;font-size:12px;color:#8a93a3;line-height:1.6;">
      You are receiving this because you signed in to the JHS website with Google.
      <a href="{esc(unsub, quote=True)}" style="color:#8a93a3;">Unsubscribe</a> at any time.
    </td></tr>"""
    html = email_service._wrap_html(f"New on JHS: {label}", body)
    subject = f"New {label}: {title}"
    one_click = f"{site}/api/notifications/unsubscribe-one-click?token={make_token(uid)}"
    headers = {"List-Unsubscribe": f"<{one_click}>", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"}
    return subject, html, headers


async def send_test(kind: str, to_email: str, to_name: str) -> bool:
    """Sample email to the admin who asks for it (never to users)."""
    label, _ = KINDS.get(kind, KINDS["white_paper"])
    subject, html, headers = render_email(kind if kind in KINDS else "white_paper", "Sample insight title",
                                          "This is how a new insight notification looks to your subscribers.",
                                          to_name, "0" * 24)
    return await email_service._send_email(to_email, to_name, f"[TEST] {subject}", html, headers)


# ── the worker ──────────────────────────────────────────────────────────────

async def _claim_job() -> Optional[dict]:
    db = get_database()
    now = datetime.now(timezone.utc)
    return await db[JOBS].find_one_and_update(
        {"$or": [{"status": "scheduled", "send_at": {"$lte": now}},
                 {"status": "sending", "lease_until": {"$lt": now}}]},      # a crashed run is resumed
        {"$set": {"status": "sending", "lease_until": now + LEASE}},
        sort=[("send_at", 1)], return_document=True)


async def run_job(job: dict, gap: float = SEND_GAP_SECONDS) -> None:
    db = get_database()
    jid = job["_id"]
    query = recipients_filter()
    if job.get("cursor"):
        query = {**query, "_id": {"$gt": ObjectId(job["cursor"])}}
    if job.get("total") is None:
        await db[JOBS].update_one({"_id": jid}, {"$set": {"total": await db[USERS].count_documents(recipients_filter())}})

    async for user in db[USERS].find(query, {"email": 1, "first_name": 1, "name": 1}).sort("_id", 1):
        current = await db[JOBS].find_one({"_id": jid}, {"status": 1})
        if not current or current["status"] != "sending":
            return                                                          # cancelled while running
        name = user.get("first_name") or user.get("name") or ""
        subject, html, headers = render_email(job["kind"], job["title"], job["summary"], name, str(user["_id"]))
        ok = await email_service._send_email(user["email"], name, subject, html, headers)
        await db[JOBS].update_one({"_id": jid}, {
            "$inc": {"sent" if ok else "failed": 1},
            "$set": {"cursor": str(user["_id"]), "lease_until": datetime.now(timezone.utc) + LEASE}})
        await asyncio.sleep(gap)

    await db[JOBS].update_one({"_id": jid, "status": "sending"},
                              {"$set": {"status": "sent", "finished_at": datetime.now(timezone.utc), "lease_until": None}})
    logger.info("Notification job %s finished", jid)


async def worker_loop() -> None:
    logger.info("Notification worker started")
    while True:
        try:
            job = await _claim_job()
            if job:
                await run_job(job)
                continue
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Notification worker error")
        await asyncio.sleep(POLL_SECONDS)


# ── admin helpers ───────────────────────────────────────────────────────────

def _out(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    for k in ("cursor", "lease_until"):
        doc.pop(k, None)
    return doc


async def list_jobs(limit: int = 50) -> list[dict]:
    cursor = get_database()[JOBS].find({}).sort("created_at", -1).limit(max(1, min(limit, 200)))
    return [_out(d) async for d in cursor]


def _oid(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise NotifyError(404, "Not found")


async def cancel_job(job_id: str) -> None:
    res = await get_database()[JOBS].update_one(
        {"_id": _oid(job_id), "status": {"$in": ["scheduled", "sending"]}},
        {"$set": {"status": "cancelled", "finished_at": datetime.now(timezone.utc)}})
    if res.matched_count != 1:
        raise NotifyError(409, "This notification has already finished or does not exist")


async def send_now(job_id: str) -> None:
    res = await get_database()[JOBS].update_one(
        {"_id": _oid(job_id), "status": "scheduled"}, {"$set": {"send_at": datetime.now(timezone.utc)}})
    if res.matched_count != 1:
        raise NotifyError(409, "Only a scheduled notification can be sent now")
