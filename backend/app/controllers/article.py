from bson import ObjectId
from datetime import datetime
from app.database.connection import get_database
from app.schemas.article import ArticleCreate

COLLECTION = "Articles"


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_article(data: ArticleCreate) -> dict:
    db = get_database()
    collection = db[COLLECTION]
    payload = data.model_dump()
    payload["created_at"] = datetime.utcnow()
    result = await collection.insert_one(payload)
    created = await collection.find_one({"_id": result.inserted_id})
    return _serialize(created)


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
    result = await collection.delete_one({"_id": ObjectId(article_id)})
    return result.deleted_count == 1