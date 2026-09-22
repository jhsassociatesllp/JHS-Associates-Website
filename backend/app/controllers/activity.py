from datetime import datetime, timezone

from app.database.connection import get_database

ACTIVITY_COLLECTION = "user_activity"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def log_download(user: dict, resource_type: str, resource_id: str, resource_title: str) -> None:
    """Fire-and-record a download activity row. Failures here must never
    break the actual file download, so callers should not let an exception
    from this function bubble into the HTTP response."""
    db = get_database()
    await db[ACTIVITY_COLLECTION].insert_one(
        {
            "user_id": user["id"],
            "user_name": user.get("name") or user.get("email", ""),
            "user_email": user.get("email", ""),
            "type": "download",
            "resource_type": resource_type,
            "resource_id": resource_id,
            "resource_title": resource_title,
            "created_at": datetime.now(timezone.utc),
        }
    )


async def list_activity_for_user(user_id: str) -> list[dict]:
    db = get_database()
    activity = []
    cursor = db[ACTIVITY_COLLECTION].find({"user_id": user_id}).sort("created_at", -1)
    async for doc in cursor:
        activity.append(_serialize(doc))
    return activity


async def list_all_activity() -> list[dict]:
    db = get_database()
    activity = []
    cursor = db[ACTIVITY_COLLECTION].find({}).sort("created_at", -1).limit(500)
    async for doc in cursor:
        activity.append(_serialize(doc))
    return activity
