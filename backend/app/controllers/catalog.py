import re

from bson import ObjectId

from app.database.connection import get_database
from app.schemas.catalog import SectorIn, ServiceIn

SERVICES = "services"
SECTORS = "sectors"
PEOPLE = "leadership"


def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "service"


def _service_out(doc: dict) -> dict:
    doc.pop("_id", None)
    doc["points"] = sorted(doc.get("points", []), key=lambda p: (p.get("order", 0), p.get("id", "")))
    return doc


def _sector_out(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


# ── Services ────────────────────────────────────────────────────────────────

async def list_services() -> list[dict]:
    cursor = get_database()[SERVICES].find({}).sort("order", 1)
    return [_service_out(d) async for d in cursor]


async def get_service(key: str) -> dict | None:
    doc = await get_database()[SERVICES].find_one({"key": key})
    return _service_out(doc) if doc else None


def _clean_points(points) -> list[dict]:
    """Keep ids stable, give new sub-services the next free id, drop blanks."""
    used = {p.id for p in points if p.id}
    next_n = max([int(i) for i in used if i.isdigit()] + [0]) + 1
    cleaned = []
    for idx, p in enumerate(points, start=1):
        title = p.title.strip()
        if not title:
            continue
        pid = p.id
        if not pid:
            pid = str(next_n).zfill(2)
            next_n += 1
        cleaned.append({"id": pid, "title": title, "desc": p.desc.strip(), "order": idx})
    return cleaned


async def create_service(data: ServiceIn) -> dict:
    col = get_database()[SERVICES]
    base = _slug(data.name)
    key, n = base, 2
    while await col.find_one({"key": key}):
        key = f"{base}-{n}"
        n += 1
    last = await col.find_one({}, sort=[("order", -1)])
    doc = {
        "key": key,
        "name": data.name.strip(),
        "order": data.order if data.order is not None else (last["order"] + 1 if last else 1),
        "points": _clean_points(data.points),
    }
    await col.insert_one(dict(doc))
    return doc


async def update_service(key: str, data: ServiceIn) -> dict | None:
    db = get_database()
    existing = await db[SERVICES].find_one({"key": key})
    if not existing:
        return None
    new_name = data.name.strip()
    points = _clean_points(data.points)
    patch = {"name": new_name, "points": points}
    if data.order is not None:
        patch["order"] = data.order
    await db[SERVICES].update_one({"key": key}, {"$set": patch})

    # Keep people in step with the catalog
    if new_name != existing["name"]:
        await db[PEOPLE].update_many({"services": existing["name"]}, {"$set": {"services.$[s]": new_name}},
                                     array_filters=[{"s": existing["name"]}])
    live = {f"{key}:{p['id']}" for p in points}
    removed = [f"{key}:{p['id']}" for p in existing.get("points", []) if f"{key}:{p['id']}" not in live]
    if removed:
        await db[PEOPLE].update_many({"service_points": {"$in": removed}}, {"$pull": {"service_points": {"$in": removed}}})
    return await get_service(key)


async def delete_service(key: str) -> bool:
    db = get_database()
    existing = await db[SERVICES].find_one({"key": key})
    if not existing:
        return False
    await db[SERVICES].delete_one({"key": key})
    await db[PEOPLE].update_many({}, {"$pull": {"services": existing["name"],
                                                "service_points": {"$regex": f"^{re.escape(key)}:"}}})
    return True


# ── Sectors ─────────────────────────────────────────────────────────────────

async def list_sectors() -> list[dict]:
    cursor = get_database()[SECTORS].find({}).sort("order", 1)
    return [_sector_out(d) async for d in cursor]


async def create_sector(data: SectorIn) -> dict | None:
    col = get_database()[SECTORS]
    name = data.name.strip()
    if await col.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}}):
        return None
    last = await col.find_one({}, sort=[("order", -1)])
    order = data.order if data.order is not None else (last["order"] + 1 if last else 1)
    result = await col.insert_one({"name": name, "order": order})
    return _sector_out(await col.find_one({"_id": result.inserted_id}))


async def update_sector(sector_id: str, data: SectorIn) -> dict | None:
    db = get_database()
    existing = await db[SECTORS].find_one({"_id": ObjectId(sector_id)})
    if not existing:
        return None
    name = data.name.strip()
    patch = {"name": name}
    if data.order is not None:
        patch["order"] = data.order
    await db[SECTORS].update_one({"_id": existing["_id"]}, {"$set": patch})
    if name != existing["name"]:
        await db[PEOPLE].update_many({"sectors": existing["name"]}, {"$set": {"sectors.$[s]": name}},
                                     array_filters=[{"s": existing["name"]}])
    return _sector_out(await db[SECTORS].find_one({"_id": existing["_id"]}))


async def delete_sector(sector_id: str) -> bool:
    db = get_database()
    existing = await db[SECTORS].find_one({"_id": ObjectId(sector_id)})
    if not existing:
        return False
    await db[SECTORS].delete_one({"_id": existing["_id"]})
    await db[PEOPLE].update_many({}, {"$pull": {"sectors": existing["name"]}})
    return True
