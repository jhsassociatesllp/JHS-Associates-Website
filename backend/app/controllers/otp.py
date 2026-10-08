"""Mobile OTP (two-step verification) used before an appointment can be booked.

* 6-digit random code (secrets), valid 5 minutes, only a keyed hash is stored.
* Max 5 wrong guesses per code, then the code is dead.
* A successful check returns a short-lived signed `otp_token` bound to the signed-in
  user and the verified mobile; booking requires it and consumes it (single use).
"""
import hashlib
import hmac
import re
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt

from app.auth.security import ALGORITHM, SECRET_KEY, create_access_token
from app.database.connection import get_database
from app.services import sms_service

OTP_COLLECTION = "otp_codes"
USED_TOKENS = "otp_used_tokens"
OTP_TTL = timedelta(minutes=5)          # requirement: 5 minutes to validate
RESEND_COOLDOWN_SECONDS = 30
MAX_ATTEMPTS = 5
MAX_SENDS_PER_HOUR = 5                  # per mobile and per user
TOKEN_TTL = timedelta(minutes=20)       # time allowed to finish the booking form after verifying
MOBILE_RE = re.compile(r"^[6-9]\d{9}$")


class OtpError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


async def _ensure_indexes() -> None:
    db = get_database()
    await db[OTP_COLLECTION].create_index("expires_at", expireAfterSeconds=0)
    await db[OTP_COLLECTION].create_index([("user_id", 1), ("mobile", 1)])
    await db[USED_TOKENS].create_index("expires_at", expireAfterSeconds=0)


def _digest(user_id: str, mobile: str, otp: str) -> str:
    msg = f"{user_id}:{mobile}:{otp}".encode()
    return hmac.new(str(SECRET_KEY).encode(), msg, hashlib.sha256).hexdigest()


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def valid_mobile(mobile: str) -> bool:
    return bool(MOBILE_RE.match(mobile or ""))


async def send_code(user: dict, mobile: str) -> int:
    """Create + send a new code. Returns the resend cooldown in seconds."""
    if not valid_mobile(mobile):
        raise OtpError(422, "Enter a valid 10-digit mobile number")
    if not sms_service.is_configured():
        raise OtpError(503, "OTP service is not available right now. Please try again later.")

    await _ensure_indexes()
    db = get_database()
    now = datetime.now(timezone.utc)
    uid = user["id"]

    last = await db[OTP_COLLECTION].find_one({"user_id": uid, "mobile": mobile}, sort=[("created_at", -1)])
    if last and (now - _aware(last["created_at"])).total_seconds() < RESEND_COOLDOWN_SECONDS:
        raise OtpError(429, "Please wait a few seconds before requesting another OTP.")

    hour_ago = now - timedelta(hours=1)
    by_mobile = await db[OTP_COLLECTION].count_documents({"mobile": mobile, "created_at": {"$gte": hour_ago}})
    by_user = await db[OTP_COLLECTION].count_documents({"user_id": uid, "created_at": {"$gte": hour_ago}})
    if by_mobile >= MAX_SENDS_PER_HOUR or by_user >= MAX_SENDS_PER_HOUR:
        raise OtpError(429, "Too many OTP requests. Please try again after some time.")

    otp = f"{secrets.randbelow(1_000_000):06d}"
    result = await db[OTP_COLLECTION].insert_one({
        "user_id": uid, "mobile": mobile, "code_hash": _digest(uid, mobile, otp),
        "attempts": 0, "created_at": now, "expires_at": now + OTP_TTL,
    })
    # one live code at a time per user+mobile (older ones are replaced)
    await db[OTP_COLLECTION].delete_many({"user_id": uid, "mobile": mobile, "_id": {"$ne": result.inserted_id}})
    try:
        await sms_service.send_otp_sms(mobile, otp)
    except sms_service.SmsError:
        await db[OTP_COLLECTION].delete_one({"_id": result.inserted_id})
        raise OtpError(502, "We could not send the OTP right now. Please try again shortly.")
    return RESEND_COOLDOWN_SECONDS


async def verify_code(user: dict, mobile: str, otp: str) -> str:
    """Check the code; on success return a single-use `otp_token`."""
    if not valid_mobile(mobile) or not re.fullmatch(r"\d{6}", otp or ""):
        raise OtpError(422, "Enter the 6-digit code")
    db = get_database()
    now = datetime.now(timezone.utc)
    uid = user["id"]

    doc = await db[OTP_COLLECTION].find_one({"user_id": uid, "mobile": mobile})
    if not doc or _aware(doc["expires_at"]) <= now:
        raise OtpError(400, "This OTP has expired. Please request a new one.")
    if doc.get("attempts", 0) >= MAX_ATTEMPTS:
        await db[OTP_COLLECTION].delete_one({"_id": doc["_id"]})
        raise OtpError(429, "Too many wrong attempts. Please request a new OTP.")

    if not hmac.compare_digest(doc["code_hash"], _digest(uid, mobile, otp)):
        updated = await db[OTP_COLLECTION].find_one_and_update(
            {"_id": doc["_id"]}, {"$inc": {"attempts": 1}}, return_document=True)
        left = MAX_ATTEMPTS - (updated or doc).get("attempts", MAX_ATTEMPTS)
        if left <= 0:
            await db[OTP_COLLECTION].delete_one({"_id": doc["_id"]})
            raise OtpError(429, "Too many wrong attempts. Please request a new OTP.")
        raise OtpError(400, f"Invalid OTP. {left} attempt{'s' if left != 1 else ''} left.")

    # A code works once: the delete decides the winner if two requests race.
    deleted = await db[OTP_COLLECTION].delete_one({"_id": doc["_id"]})
    if deleted.deleted_count != 1:
        raise OtpError(400, "This OTP has expired. Please request a new one.")
    return create_access_token(
        {"sub": user["email"], "uid": uid, "mobile": mobile, "jti": uuid.uuid4().hex, "type": "otp_verified"},
        expires_delta=TOKEN_TTL,
    )


async def consume_token(user: dict, mobile: Optional[str], token: Optional[str]) -> None:
    """Called when booking: the token must be valid, for this user and mobile, and unused."""
    err = OtpError(403, "Mobile verification required. Please verify your mobile number with OTP.")
    if not token:
        raise err
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError:
        raise err
    if payload.get("type") != "otp_verified" or payload.get("uid") != user["id"] or payload.get("mobile") != mobile:
        raise err
    jti = payload.get("jti")
    if not jti:
        raise err
    await _ensure_indexes()
    db = get_database()
    try:
        await db[USED_TOKENS].insert_one({"_id": jti, "expires_at": datetime.now(timezone.utc) + TOKEN_TTL})
    except Exception:  # duplicate key -> already used
        raise OtpError(403, "This verification was already used. Please verify your mobile again.")
