from bson import ObjectId
from datetime import datetime
from app.database.connection import get_database
from app.schemas.blog import BlogCreate

COLLECTION = "Blogs"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_blog(data: BlogCreate) -> dict:
    db = get_database()
    collection = db[COLLECTION]
    payload = data.model_dump()
    payload["created_at"] = datetime.utcnow()
    result = await collection.insert_one(payload)
    created = await collection.find_one({"_id": result.inserted_id})
    return _serialize(created)


async def get_all_blogs() -> list[dict]:
    db = get_database()
    collection = db[COLLECTION]
    blogs = []
    async for doc in collection.find().sort("created_at", -1):
        blogs.append(_serialize(doc))
    return blogs


async def get_blog_by_id(blog_id: str) -> dict | None:
    db = get_database()
    collection = db[COLLECTION]
    doc = await collection.find_one({"_id": ObjectId(blog_id)})
    return _serialize(doc) if doc else None


async def delete_blog(blog_id: str) -> bool:
    db = get_database()
    collection = db[COLLECTION]
    result = await collection.delete_one({"_id": ObjectId(blog_id)})
    return result.deleted_count == 1