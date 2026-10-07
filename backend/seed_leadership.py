"""Seed the `leadership` collection from data/leadership_seed.json.

This is the data that used to be hard-coded in the frontend's Partners.tsx.
Safe to re-run: people already present (matched by name) are left untouched,
so admin-panel edits are never overwritten.

    cd backend
    python seed_leadership.py
"""
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

from app.config.settings import settings

SEED_FILE = Path(__file__).parent / "data" / "leadership_seed.json"
CATALOG_FILE = Path(__file__).parent / "data" / "catalog_seed.json"


async def main() -> None:
    people = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    client = AsyncIOMotorClient(settings.mongodb_url)
    collection = client[settings.database_name]["leadership"]

    added = skipped = updated = 0
    for person in people:
        existing = await collection.find_one({"name": person["name"]})
        if existing:
            # Never overwrite admin edits: only fill in what is still empty
            # (city-page assignments and contact emails added later).
            fill = {}
            if person.get("cities") and not existing.get("cities"):
                fill["cities"] = person["cities"]
            if person.get("email") and not existing.get("email"):
                fill["email"] = person["email"]
            if person.get("service_points") and not existing.get("service_points"):
                fill["service_points"] = person["service_points"]
                fill["services"] = sorted(set(existing.get("services") or []) | set(person.get("services") or []))
            if fill:
                await collection.update_one({"_id": existing["_id"]}, {"$set": fill})
                updated += 1
            else:
                skipped += 1
            continue
        now = datetime.now(timezone.utc)
        await collection.insert_one({**person, "created_at": now, "updated_at": now})
        added += 1

    # Services (with sub-services) and sectors: only created when missing, so
    # anything edited in the admin panel is never overwritten.
    catalog = json.loads(CATALOG_FILE.read_text(encoding="utf-8"))
    db = client[settings.database_name]
    svc_added = sec_added = 0
    for svc in catalog["services"]:
        if not await db["services"].find_one({"key": svc["key"]}):
            await db["services"].insert_one(svc)
            svc_added += 1
    for sec in catalog["sectors"]:
        if not await db["sectors"].find_one({"name": sec["name"]}):
            await db["sectors"].insert_one(sec)
            sec_added += 1
    print(f"Catalog seed complete: {svc_added} services, {sec_added} sectors added.")

    await collection.create_index([("display_order", 1)])
    print(f"Leadership seed complete: {added} added, {updated} filled in (cities/emails), {skipped} unchanged.")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
