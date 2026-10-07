from datetime import datetime, timezone
from io import BytesIO

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.database.connection import get_database
from app.utils.image import convert_to_webp, webp_filename

COLLECTION = "leadership"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def list_members(include_inactive: bool = False) -> list[dict]:
    query = {} if include_inactive else {"status": "Active"}
    cursor = get_database()[COLLECTION].find(query).sort([("display_order", 1), ("name", 1)])
    return [_serialize(doc) async for doc in cursor]


async def get_member(member_id: str) -> dict | None:
    doc = await get_database()[COLLECTION].find_one({"_id": ObjectId(member_id)})
    return _serialize(doc) if doc else None


async def create_member(data: dict) -> dict:
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    result = await get_database()[COLLECTION].insert_one(data)
    return await get_member(str(result.inserted_id))


async def update_member(member_id: str, data: dict) -> dict | None:
    data["updated_at"] = datetime.now(timezone.utc)
    result = await get_database()[COLLECTION].update_one(
        {"_id": ObjectId(member_id)}, {"$set": data}
    )
    if result.matched_count == 0:
        return None
    return await get_member(member_id)


async def delete_member(member_id: str) -> bool:
    db = get_database()
    doc = await db[COLLECTION].find_one({"_id": ObjectId(member_id)})
    if not doc:
        return False
    if doc.get("photo_id"):
        await delete_photo(doc["photo_id"])
    await db[COLLECTION].delete_one({"_id": ObjectId(member_id)})
    return True


async def upload_photo(content: bytes, filename: str, content_type: str | None) -> str:
    fs = AsyncIOMotorGridFSBucket(get_database())
    webp_bytes = convert_to_webp(content)
    if webp_bytes is not None:
        content, filename, content_type = webp_bytes, webp_filename(filename), "image/webp"
    file_id = await fs.upload_from_stream(
        filename,
        BytesIO(content),
        metadata={"contentType": content_type or "application/octet-stream"},
    )
    return str(file_id)


async def delete_photo(photo_id: str) -> None:
    try:
        await AsyncIOMotorGridFSBucket(get_database()).delete(ObjectId(photo_id))
    except Exception:
        pass


async def get_photo(photo_id: str) -> tuple[bytes, str, str]:
    fs = AsyncIOMotorGridFSBucket(get_database())
    grid_out = await fs.open_download_stream(ObjectId(photo_id))
    content = await grid_out.read()
    meta = grid_out.metadata or {}
    return content, grid_out.filename or "photo", meta.get("contentType", "application/octet-stream")
