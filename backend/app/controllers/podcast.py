"""Podcasts: episodes added from the admin panel (cover image stored in our own collection)."""
import re
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlparse

from bson import Binary, ObjectId
from bson.errors import InvalidId

from app.database.connection import get_database
from app.schemas.podcast import PLATFORMS
from app.utils.image import convert_to_webp, webp_filename

COLLECTION = "podcasts"
FILES = "podcast_files"
MAX_IMAGE_BYTES = 5 * 1024 * 1024
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class PodcastError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


def _oid(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise PodcastError(404, "Not found")


def _out(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def clean_fields(title, description, guest, duration, platform, listen_url, published_on, status) -> dict:
    title, description = (title or "").strip(), (description or "").strip()
    guest = (guest or "").strip() or None
    duration = (duration or "").strip() or None
    listen_url = (listen_url or "").strip()
    if not 3 <= len(title) <= 200:
        raise PodcastError(422, "Title must be 3 to 200 characters")
    if not 3 <= len(description) <= 500:
        raise PodcastError(422, "Description must be 3 to 500 characters")
    if guest and len(guest) > 120:
        raise PodcastError(422, "Guest name is too long")
    if duration and len(duration) > 30:
        raise PodcastError(422, "Duration is too long")
    if platform not in PLATFORMS:
        raise PodcastError(422, "Choose a platform from the list")
    parsed = urlparse(listen_url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc or len(listen_url) > 500:
        raise PodcastError(422, "Enter a valid link starting with https://")
    try:
        if not DATE_RE.match(published_on or ""):
            raise ValueError
        datetime.strptime(published_on, "%Y-%m-%d")
    except ValueError:
        raise PodcastError(422, "Enter a valid date")
    if status not in ("draft", "published"):
        raise PodcastError(422, "Invalid status")
    return {"title": title, "description": description, "guest": guest, "duration": duration,
            "platform": platform, "listen_url": listen_url, "published_on": published_on, "status": status}


async def upload_image(content: bytes, filename: str) -> str:
    if not content or len(content) > MAX_IMAGE_BYTES:
        raise PodcastError(422, "The cover image must be under 5 MB")
    webp = convert_to_webp(content)
    if webp is None:
        raise PodcastError(422, "Please upload a valid image (JPG, PNG or WebP)")
    res = await get_database()[FILES].insert_one({
        "filename": webp_filename(filename or "cover"), "content_type": "image/webp",
        "size": len(webp), "data": Binary(webp), "created_at": datetime.now(timezone.utc),
    })
    return str(res.inserted_id)


async def delete_file(file_id: Optional[str]) -> None:
    if not file_id:
        return
    try:
        await get_database()[FILES].delete_one({"_id": ObjectId(file_id)})
    except Exception:
        pass


async def list_public(limit: int = 30) -> list[dict]:
    cursor = get_database()[COLLECTION].find({"status": "published"}, {"status": 0, "updated_at": 0, "last_edited_by": 0}) \
        .sort([("published_on", -1), ("created_at", -1)]).limit(max(1, min(limit, 100)))
    return [_out(d) async for d in cursor]


async def list_admin() -> list[dict]:
    cursor = get_database()[COLLECTION].find({}).sort([("published_on", -1), ("created_at", -1)])
    return [_out(d) async for d in cursor]


async def create(fields: dict, image_id: Optional[str], admin_name: str) -> dict:
    now = datetime.now(timezone.utc)
    doc = {**fields, "image_id": image_id, "created_at": now, "updated_at": now, "last_edited_by": admin_name}
    res = await get_database()[COLLECTION].insert_one(doc)
    return _out(await get_database()[COLLECTION].find_one({"_id": res.inserted_id}))


async def update(item_id: str, fields: dict, image_id: Optional[str], admin_name: str) -> dict:
    db = get_database()
    current = await db[COLLECTION].find_one({"_id": _oid(item_id)})
    if not current:
        raise PodcastError(404, "Not found")
    changes = {**fields, "updated_at": datetime.now(timezone.utc), "last_edited_by": admin_name}
    if image_id:
        changes["image_id"] = image_id
    await db[COLLECTION].update_one({"_id": current["_id"]}, {"$set": changes})
    if image_id and current.get("image_id"):
        await delete_file(current["image_id"])
    return _out(await db[COLLECTION].find_one({"_id": current["_id"]}))


async def delete(item_id: str) -> None:
    db = get_database()
    doc = await db[COLLECTION].find_one({"_id": _oid(item_id)})
    if not doc:
        raise PodcastError(404, "Not found")
    await db[COLLECTION].delete_one({"_id": doc["_id"]})
    await delete_file(doc.get("image_id"))


async def published_has_image(image_id: str) -> bool:
    return bool(await get_database()[COLLECTION].find_one({"image_id": image_id, "status": "published"}, {"_id": 1}))


async def read_image(file_id: str) -> tuple[bytes, str, str]:
    doc = await get_database()[FILES].find_one({"_id": _oid(file_id)})
    if not doc:
        raise PodcastError(404, "Not found")
    return bytes(doc["data"]), doc.get("filename", "cover.webp"), doc.get("content_type", "image/webp")


async def current_status(item_id: str) -> Optional[str]:
    doc = await get_database()[COLLECTION].find_one({"_id": _oid(item_id)}, {"status": 1})
    return doc.get("status") if doc else None
