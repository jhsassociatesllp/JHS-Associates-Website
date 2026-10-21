from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from app.database.connection import get_database
from app.schemas.consultation import ConsultationRequestCreate
from app.services.email_service import notify_hr_new_consultation_request

CONSULTING_USERS_COLLECTION = "consulting_users"
CONSULTATION_REQUESTS_COLLECTION = "consultation_requests"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def upsert_consulting_user_from_google(payload: dict) -> dict:
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

    existing = await db[CONSULTING_USERS_COLLECTION].find_one({"email": email})
    if existing:
        # Deliberately NOT touching `status` here — an admin-suspended
        # account must stay suspended across repeat Google sign-ins, not
        # get silently reset to "active" on every login.
        await db[CONSULTING_USERS_COLLECTION].update_one(
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
        user = await db[CONSULTING_USERS_COLLECTION].find_one({"_id": existing["_id"]})
    else:
        result = await db[CONSULTING_USERS_COLLECTION].insert_one(
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
        user = await db[CONSULTING_USERS_COLLECTION].find_one({"_id": result.inserted_id})

    return _serialize(user)


async def get_consulting_user_by_id(user_id: str) -> Optional[dict]:
    db = get_database()
    try:
        object_id = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None

    doc = await db[CONSULTING_USERS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None


async def create_consultation_request(data: ConsultationRequestCreate, user: dict) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    payload.update(
        {
            "user_id": user["id"],
            "user_name": user["name"],
            "user_email": user["email"],
            "user_picture": user.get("picture"),
            "status": "new",
            "created_at": now,
            "updated_at": now,
        }
    )

    result = await db[CONSULTATION_REQUESTS_COLLECTION].insert_one(payload)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_consultation_request(payload)

    created = await db[CONSULTATION_REQUESTS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def list_consultation_requests() -> list[dict]:
    db = get_database()
    requests = []
    async for doc in db[CONSULTATION_REQUESTS_COLLECTION].find({}).sort("created_at", -1):
        requests.append(_serialize(doc))
    return requests


async def update_consultation_request_status(request_id: str, status_value: str) -> Optional[dict]:
    db = get_database()
    try:
        object_id = ObjectId(request_id)
    except (InvalidId, TypeError):
        raise ValueError("Invalid id")

    result = await db[CONSULTATION_REQUESTS_COLLECTION].update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": status_value,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    if result.matched_count == 0:
        return None

    doc = await db[CONSULTATION_REQUESTS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None
