from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.auth.security import get_password_hash, verify_password
from app.database.connection import get_database
from app.schemas.user import UserSignup

USERS_COLLECTION = "users"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    doc.pop("password_hash", None)
    first = (doc.get("first_name") or "").strip()
    last = (doc.get("last_name") or "").strip()
    doc["name"] = f"{first} {last}".strip() or doc.get("email", "")
    return doc


async def get_user_by_email(email: str) -> Optional[dict]:
    db = get_database()
    return await db[USERS_COLLECTION].find_one({"email": email})


async def create_user_with_password(data: UserSignup) -> dict:
    db = get_database()

    if await get_user_by_email(data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    now = datetime.now(timezone.utc)
    doc = {
        "first_name": data.first_name.strip(),
        "last_name": data.last_name.strip(),
        "email": data.email,
        "password_hash": get_password_hash(data.password),
        "picture": None,
        "google_id": None,
        "auth_provider": "password",
        "is_verified": False,
        "status": "active",
        "created_at": now,
        "last_login": now,
    }
    result = await db[USERS_COLLECTION].insert_one(doc)
    user = await db[USERS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(user)


async def authenticate_user(email: str, password: str) -> dict:
    db = get_database()
    user = await db[USERS_COLLECTION].find_one({"email": email})

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
    )

    if not user or not user.get("password_hash"):
        raise invalid_credentials
    if not verify_password(password, user["password_hash"]):
        raise invalid_credentials

    await db[USERS_COLLECTION].update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc)}},
    )
    user = await db[USERS_COLLECTION].find_one({"_id": user["_id"]})
    return _serialize(user)


async def upsert_user_from_google(payload: dict) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    email = payload["email"]
    google_id = payload.get("sub")
    picture = payload.get("picture")
    is_verified = bool(payload.get("email_verified", False))

    given_name = payload.get("given_name")
    family_name = payload.get("family_name")
    full_name = payload.get("name") or email.split("@")[0]
    if not given_name:
        parts = full_name.split(" ", 1)
        given_name = parts[0]
        family_name = family_name or (parts[1] if len(parts) > 1 else "")

    existing = await db[USERS_COLLECTION].find_one({"email": email})
    if existing:
        # Deliberately NOT touching `status` (admin-suspended stays
        # suspended) or first/last name (don't clobber a name the user
        # typed at signup just because they later use "Continue with
        # Google" with a differently-formatted Google display name).
        await db[USERS_COLLECTION].update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "picture": picture,
                    "google_id": google_id,
                    "is_verified": is_verified or existing.get("is_verified", False),
                    "last_login": now,
                }
            },
        )
        user = await db[USERS_COLLECTION].find_one({"_id": existing["_id"]})
    else:
        result = await db[USERS_COLLECTION].insert_one(
            {
                "first_name": given_name,
                "last_name": family_name or "",
                "email": email,
                "password_hash": None,
                "picture": picture,
                "google_id": google_id,
                "auth_provider": "google",
                "is_verified": is_verified,
                "status": "active",
                "created_at": now,
                "last_login": now,
            }
        )
        user = await db[USERS_COLLECTION].find_one({"_id": result.inserted_id})

    return _serialize(user)


async def get_user_by_id(user_id: str) -> Optional[dict]:
    db = get_database()
    try:
        object_id = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None

    doc = await db[USERS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None


async def list_all_users() -> list[dict]:
    db = get_database()
    users = []
    cursor = db[USERS_COLLECTION].find({}).sort("created_at", -1)
    async for doc in cursor:
        users.append(_serialize(doc))
    return users


def _serialize_activity_doc(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def get_user_activity_summary(user_id: str) -> dict:
    """Fan out across every collection a signed-in action can land in,
    filtered by user_id — rather than a second copy of that data, this
    reads the same rows the admin already sees on the Careers/Proposals/
    Appointments pages, just grouped by the account that submitted them."""
    db = get_database()

    async def _find(collection: str, field: str = "user_id") -> list[dict]:
        docs = []
        cursor = db[collection].find({field: user_id}).sort("created_at", -1)
        async for doc in cursor:
            docs.append(_serialize_activity_doc(doc))
        return docs

    downloads = await _find("user_activity")
    # career_applications stamps the submitter under "applicant_id" (an
    # older, feature-specific field name predating this unified account
    # system) rather than "user_id" — queried accordingly rather than
    # renamed, to avoid touching the careers admin view's field contract.
    applications = await _find("career_applications", field="applicant_id")
    proposals = await _find("proposals")
    appointments = await _find("appointments")
    consultations = await _find("consultation_requests")

    return {
        "downloads": downloads,
        "job_applications": applications,
        "proposals": proposals,
        "appointments": appointments,
        "consultation_requests": consultations,
    }
