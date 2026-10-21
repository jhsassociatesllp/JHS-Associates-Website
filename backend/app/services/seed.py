"""First-run seed for a fresh database (e.g. a new staging server).

Fills the leadership / services / sectors collections from backend/data/*.json
ONLY when they are empty and have never been seeded before. A marker document
in `app_meta` records that the check ran, so people an admin deletes later are
never brought back, and existing data is never overwritten.
"""
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from app.database.connection import get_database

logger = logging.getLogger("seed")

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
MARKER = "default_content_seed_v1"


async def seed_defaults() -> None:
    try:
        db = get_database()
        if await db["app_meta"].find_one({"_id": MARKER}):
            return

        now = datetime.now(timezone.utc)
        people_file = DATA_DIR / "leadership_seed.json"
        catalog_file = DATA_DIR / "catalog_seed.json"

        if await db["leadership"].count_documents({}) == 0 and people_file.exists():
            people = json.loads(people_file.read_text(encoding="utf-8"))
            for person in people:
                await db["leadership"].insert_one({**person, "created_at": now, "updated_at": now})
            await db["leadership"].create_index([("display_order", 1)])
            logger.info("Seeded %d leadership records", len(people))

        if catalog_file.exists():
            catalog = json.loads(catalog_file.read_text(encoding="utf-8"))
            if await db["services"].count_documents({}) == 0:
                for svc in catalog.get("services", []):
                    await db["services"].insert_one(svc)
                logger.info("Seeded %d services", len(catalog.get("services", [])))
            if await db["sectors"].count_documents({}) == 0:
                for sec in catalog.get("sectors", []):
                    await db["sectors"].insert_one(sec)
                logger.info("Seeded %d sectors", len(catalog.get("sectors", [])))

        await db["app_meta"].insert_one({"_id": MARKER, "ran_at": now})
    except Exception:  # never stop the API from starting because of seeding
        logger.exception("Default content seed failed (the API will still start)")
