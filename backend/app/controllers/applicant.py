from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.config.settings import settings
from app.database.connection import get_database

APPLICANTS_COLLECTION = "career_applicants"

_google_request = google_requests.Request()


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def verify_google_credential(credential: str) -> dict:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Sign-In is not configured",
        )

    try:
        payload = id_token.verify_oauth2_token(
            credential, _google_request, settings.google_client_id
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google sign-in token")

    if payload.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise HTTPException(status_code=401, detail="Invalid Google sign-in token")

    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Google account has no email")
    if not payload.get("email_verified", False):
        raise HTTPException(status_code=401, detail="Google email is not verified")

    return payload


async def upsert_applicant_from_google(payload: dict) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    email = payload["email"]
    google_id = payload.get("sub")
    name = payload.get("name") or email.split("@")[0]
    picture = payload.get("picture")
    # verify_google_credential already rejects unverified emails, so by the
    # time we get here this is always True — stored anyway so it's visible
    # on the record itself, not just implied by having reached this code.
    is_verified = bool(payload.get("email_verified", False))

    existing = await db[APPLICANTS_COLLECTION].find_one({"email": email})
    if existing:
        # Deliberately NOT touching `status` here — an admin-suspended
        # account must stay suspended across repeat Google sign-ins, not
        # get silently reset to "active" on every login.
        await db[APPLICANTS_COLLECTION].update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "name": name,
                    "picture": picture,
                    "google_id": google_id,
                    "auth_provider": "google",
                    "is_verified": is_verified,
                    "last_login": now,
                }
            },
        )
        applicant = await db[APPLICANTS_COLLECTION].find_one({"_id": existing["_id"]})
    else:
        result = await db[APPLICANTS_COLLECTION].insert_one(
            {
                "email": email,
                "name": name,
                "picture": picture,
                "google_id": google_id,
                "auth_provider": "google",
                "is_verified": is_verified,
                "status": "active",
                "created_at": now,
                "last_login": now,
            }
        )
        applicant = await db[APPLICANTS_COLLECTION].find_one({"_id": result.inserted_id})

    return _serialize(applicant)


async def get_applicant_by_id(applicant_id: str) -> Optional[dict]:
    db = get_database()
    try:
        object_id = ObjectId(applicant_id)
    except (InvalidId, TypeError):
        return None

    doc = await db[APPLICANTS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None
