"""Reg-Watch: regulatory updates (circulars, notifications) uploaded from the admin panel."""
import re
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from bson import Binary

from app.database.connection import get_database
from app.schemas.regwatch import REGULATORS
from app.utils.image import convert_to_webp, webp_filename

COLLECTION = "reg_watch"
FILES = "reg_watch_files"   # files live in an ordinary collection (one document per file, < 16 MB)
MAX_PDF_BYTES = 10 * 1024 * 1024
MAX_IMAGE_BYTES = 5 * 1024 * 1024
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class RegWatchError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


def _oid(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise RegWatchError(404, "Not found")


def _out(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def clean_fields(title: str, summary: str, regulator: str, reference: Optional[str], published_on: str, status: str) -> dict:
    title, summary = (title or "").strip(), (summary or "").strip()
    reference = (reference or "").strip() or None
    if not 3 <= len(title) <= 200:
        raise RegWatchError(422, "Title must be 3 to 200 characters")
    if not 3 <= len(summary) <= 500:
        raise RegWatchError(422, "Summary must be 3 to 500 characters")
    if regulator not in REGULATORS:
        raise RegWatchError(422, "Choose a regulator from the list")
    if reference and len(reference) > 120:
        raise RegWatchError(422, "Reference is too long")
    if not DATE_RE.match(published_on or ""):
        raise RegWatchError(422, "Enter a valid date")
    try:
        datetime.strptime(published_on, "%Y-%m-%d")
    except ValueError:
        raise RegWatchError(422, "Enter a valid date")
    if status not in ("draft", "published"):
        raise RegWatchError(422, "Invalid status")
    return {"title": title, "summary": summary, "regulator": regulator, "reference": reference,
            "published_on": published_on, "status": status}


def check_pdf(content: bytes) -> None:
    if not content or len(content) > MAX_PDF_BYTES:
        raise RegWatchError(422, "The PDF must be under 10 MB")
    if not content.startswith(b"%PDF-"):
        raise RegWatchError(422, "Please upload a valid PDF file")


async def _store(kind: str, filename: str, content_type: str, content: bytes) -> str:
    res = await get_database()[FILES].insert_one({
        "kind": kind, "filename": filename, "content_type": content_type,
        "size": len(content), "data": Binary(content), "created_at": datetime.now(timezone.utc),
    })
    return str(res.inserted_id)


async def upload_pdf(content: bytes, filename: str) -> str:
    check_pdf(content)
    safe = re.sub(r"[^\w.\- ]", "_", filename or "document.pdf")[:120]
    return await _store("pdf", safe, "application/pdf", content)


async def upload_image(content: bytes, filename: str, content_type: Optional[str]) -> str:
    if not content or len(content) > MAX_IMAGE_BYTES:
        raise RegWatchError(422, "The cover image must be under 5 MB")
    webp = convert_to_webp(content)
    if webp is None:
        raise RegWatchError(422, "Please upload a valid image (JPG, PNG or WebP)")
    return await _store("image", webp_filename(filename or "cover"), "image/webp", webp)


async def _delete_file(file_id: Optional[str]) -> None:
    if not file_id:
        return
    try:
        await get_database()[FILES].delete_one({"_id": ObjectId(file_id)})
    except Exception:
        pass


async def list_public(limit: int = 30, regulator: Optional[str] = None) -> list[dict]:
    q: dict = {"status": "published"}
    if regulator in REGULATORS:
        q["regulator"] = regulator
    cursor = get_database()[COLLECTION].find(q, {"status": 0, "updated_at": 0, "last_edited_by": 0}) \
        .sort([("published_on", -1), ("created_at", -1)]).limit(max(1, min(limit, 100)))
    return [_out(d) async for d in cursor]


async def list_admin() -> list[dict]:
    cursor = get_database()[COLLECTION].find({}).sort([("published_on", -1), ("created_at", -1)])
    return [_out(d) async for d in cursor]


async def create(fields: dict, pdf_id: str, image_id: Optional[str], admin_name: str) -> dict:
    now = datetime.now(timezone.utc)
    doc = {**fields, "pdf_id": pdf_id, "image_id": image_id, "created_at": now,
           "updated_at": now, "last_edited_by": admin_name}
    res = await get_database()[COLLECTION].insert_one(doc)
    return _out(await get_database()[COLLECTION].find_one({"_id": res.inserted_id}))


async def update(item_id: str, fields: dict, pdf_id: Optional[str], image_id: Optional[str], admin_name: str) -> dict:
    db = get_database()
    current = await db[COLLECTION].find_one({"_id": _oid(item_id)})
    if not current:
        raise RegWatchError(404, "Not found")
    changes = dict(fields)
    if pdf_id:
        changes["pdf_id"] = pdf_id
    if image_id:
        changes["image_id"] = image_id
    changes["updated_at"] = datetime.now(timezone.utc)
    changes["last_edited_by"] = admin_name
    await db[COLLECTION].update_one({"_id": current["_id"]}, {"$set": changes})
    if pdf_id and current.get("pdf_id"):
        await _delete_file(current["pdf_id"])
    if image_id and current.get("image_id"):
        await _delete_file(current["image_id"])
    return _out(await db[COLLECTION].find_one({"_id": current["_id"]}))


async def delete(item_id: str) -> None:
    db = get_database()
    doc = await db[COLLECTION].find_one({"_id": _oid(item_id)})
    if not doc:
        raise RegWatchError(404, "Not found")
    await db[COLLECTION].delete_one({"_id": doc["_id"]})
    await _delete_file(doc.get("pdf_id"))
    await _delete_file(doc.get("image_id"))


async def find_published_by_file(field: str, file_id: str) -> Optional[dict]:
    """Files are only served when they belong to a published item."""
    return await get_database()[COLLECTION].find_one({field: file_id, "status": "published"}, {"title": 1})


async def read_file(file_id: str) -> tuple[bytes, str, str]:
    doc = await get_database()[FILES].find_one({"_id": _oid(file_id)})
    if not doc:
        raise RegWatchError(404, "Not found")
    return bytes(doc["data"]), doc.get("filename", "file"), doc.get("content_type", "application/octet-stream")


async def current_status(item_id: str) -> Optional[str]:
    doc = await get_database()[COLLECTION].find_one({"_id": _oid(item_id)}, {"status": 1})
    return doc.get("status") if doc else None
