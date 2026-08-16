from bson import ObjectId
from datetime import datetime
from app.database.connection import get_database
from app.schemas.article import ArticleCreate, ArticleUpdate
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from app.utils.image import convert_to_webp, webp_filename
from io import BytesIO

COLLECTION = "Articles"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_article(data: ArticleCreate) -> dict:
    db = get_database()
    collection = db[COLLECTION]
    payload = data.model_dump()
    payload["created_at"] = datetime.utcnow()
    payload["edit_history"] = []
    payload["last_edited_by"] = None
    payload["last_edited_at"] = None
    result = await collection.insert_one(payload)
    created = await collection.find_one({"_id": result.inserted_id})
    return _serialize(created)


async def update_article(article_id: str, data: ArticleUpdate) -> dict:
    db = get_database()
    collection = db[COLLECTION]
    
    # Get current article
    current = await collection.find_one({"_id": ObjectId(article_id)})
    if not current:
        raise ValueError("Article not found")
    
    # Track which fields changed
    fields_changed = []
    update_data = {}
    
    for field, value in data.model_dump(exclude_unset=True, exclude={'edited_by'}).items():
        if value is not None and current.get(field) != value:
            fields_changed.append(field)
            update_data[field] = value
    
    if not fields_changed:
        return _serialize(current)
    
    # Add edit history entry
    edit_entry = {
        "edited_by": data.edited_by,
        "edited_at": datetime.utcnow(),
        "fields_changed": fields_changed
    }
    
    update_data["last_edited_by"] = data.edited_by
    update_data["last_edited_at"] = datetime.utcnow()
    
    # Update article
    await collection.update_one(
        {"_id": ObjectId(article_id)},
        {
            "$set": update_data,
            "$push": {"edit_history": edit_entry}
        }
    )
    
    updated = await collection.find_one({"_id": ObjectId(article_id)})
    return _serialize(updated)


async def get_all_articles() -> list[dict]:
    db = get_database()
    collection = db[COLLECTION]
    articles = []
    async for doc in collection.find().sort("created_at", -1):
        articles.append(_serialize(doc))
    return articles


async def get_article_by_id(article_id: str) -> dict | None:
    db = get_database()
    collection = db[COLLECTION]
    doc = await collection.find_one({"_id": ObjectId(article_id)})
    return _serialize(doc) if doc else None


async def delete_article(article_id: str) -> bool:
    db = get_database()
    collection = db[COLLECTION]
    
    # Get article to find image_id and pdf_id
    article = await collection.find_one({"_id": ObjectId(article_id)})
    if article:
        fs = AsyncIOMotorGridFSBucket(db)
        # Delete image from GridFS
        if "image_id" in article:
            try:
                await fs.delete(ObjectId(article["image_id"]))
            except Exception:
                pass
        # Delete PDF from GridFS
        if "pdf_id" in article:
            try:
                await fs.delete(ObjectId(article["pdf_id"]))
            except Exception:
                pass
    
    result = await collection.delete_one({"_id": ObjectId(article_id)})
    return result.deleted_count == 1


async def upload_image_to_gridfs(file_content: bytes, filename: str, content_type: str) -> str:
    """Upload image to GridFS as WebP and return the file ID"""
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
    webp_bytes = convert_to_webp(file_content)
    if webp_bytes is not None:
        file_content, filename, content_type = webp_bytes, webp_filename(filename), "image/webp"
    file_id = await fs.upload_from_stream(
        filename,
        BytesIO(file_content),
        metadata={"contentType": content_type}
    )
    return str(file_id)


async def upload_pdf_to_gridfs(file_content: bytes, filename: str) -> str:
    """Upload PDF to GridFS and return the file ID"""
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
    file_id = await fs.upload_from_stream(
        filename,
        BytesIO(file_content),
        metadata={"contentType": "application/pdf"}
    )
    return str(file_id)


async def get_file_from_gridfs(file_id: str) -> tuple[bytes, str, str]:
    """Retrieve file from GridFS"""
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
    grid_out = await fs.open_download_stream(ObjectId(file_id))
    content = await grid_out.read()
    filename = grid_out.filename or "file"
    content_type = grid_out.metadata.get("contentType", "application/octet-stream") if grid_out.metadata else "application/octet-stream"
    return content, filename, content_type
