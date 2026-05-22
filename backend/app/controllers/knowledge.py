from bson import ObjectId
from datetime import datetime
from app.database.connection import get_database
from app.schemas.knowledge import KnowledgeCreate, KnowledgeUpdate
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from io import BytesIO

COLLECTION = "Knowledge"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_knowledge(data: KnowledgeCreate) -> dict:
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


async def update_knowledge(knowledge_id: str, data: KnowledgeUpdate) -> dict:
    db = get_database()
    collection = db[COLLECTION]
    
    # Get current knowledge resource
    current = await collection.find_one({"_id": ObjectId(knowledge_id)})
    if not current:
        raise ValueError("Knowledge resource not found")
    
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
    
    # Update knowledge resource
    await collection.update_one(
        {"_id": ObjectId(knowledge_id)},
        {
            "$set": update_data,
            "$push": {"edit_history": edit_entry}
        }
    )
    
    updated = await collection.find_one({"_id": ObjectId(knowledge_id)})
    return _serialize(updated)


async def get_all_knowledge() -> list[dict]:
    db = get_database()
    collection = db[COLLECTION]
    knowledge_resources = []
    async for doc in collection.find().sort("created_at", -1):
        knowledge_resources.append(_serialize(doc))
    return knowledge_resources


async def get_knowledge_by_id(knowledge_id: str) -> dict | None:
    db = get_database()
    collection = db[COLLECTION]
    doc = await collection.find_one({"_id": ObjectId(knowledge_id)})
    return _serialize(doc) if doc else None


async def delete_knowledge(knowledge_id: str) -> bool:
    db = get_database()
    collection = db[COLLECTION]
    
    # Get knowledge resource to find image_id and pdf_id
    knowledge = await collection.find_one({"_id": ObjectId(knowledge_id)})
    if knowledge:
        fs = AsyncIOMotorGridFSBucket(db)
        # Delete image from GridFS
        if "image_id" in knowledge:
            try:
                await fs.delete(ObjectId(knowledge["image_id"]))
            except Exception:
                pass
        # Delete PDF from GridFS
        if "pdf_id" in knowledge:
            try:
                await fs.delete(ObjectId(knowledge["pdf_id"]))
            except Exception:
                pass
    
    result = await collection.delete_one({"_id": ObjectId(knowledge_id)})
    return result.deleted_count == 1


async def upload_image_to_gridfs(file_content: bytes, filename: str, content_type: str) -> str:
    """Upload image to GridFS and return the file ID"""
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
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