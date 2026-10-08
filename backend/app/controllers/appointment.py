from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from app.database.connection import get_database
from app.schemas.appointment import AppointmentCreate, AppointmentStatusUpdate
from app.services.email_service import notify_hr_new_appointment

APPOINTMENTS_COLLECTION = "appointments"


def _object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise ValueError("Invalid id")


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_appointment(data: AppointmentCreate, user: dict) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    payload["status"] = "new"
    payload["user_id"] = user["id"]
    payload["account_email"] = user.get("email")   # the signed-in site account that booked
    payload["mobile_verified"] = True   # booking is only reachable after a successful OTP check
    payload["created_at"] = now
    payload["updated_at"] = now

    result = await db[APPOINTMENTS_COLLECTION].insert_one(payload)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_appointment(payload)

    created = await db[APPOINTMENTS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def source_summary() -> dict:
    """How many bookings came from each place (Book Appointment page vs service / partner cards)."""
    from datetime import timedelta
    db = get_database()
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    out: dict = {"total": 0, "last_7_days": 0, "by_source": {}}
    sources = ("book_appointment_page", "services_card", "partner_card")
    for collection, default in ((APPOINTMENTS_COLLECTION, "book_appointment_page"), ("consultation_requests", "services_card")):
        # plain counts (this database server does not support $group); older rows have no `source` field
        for src in sources:
            query = {"source": src}
            if src == default:
                query = {"$or": [{"source": src}, {"source": {"$exists": False}}]}
            n = await db[collection].count_documents(query)
            if n:
                out["by_source"][src] = out["by_source"].get(src, 0) + n
                out["total"] += n
        out["last_7_days"] += await db[collection].count_documents({"created_at": {"$gte": week_ago}})
    return out


async def list_appointments() -> list[dict]:
    db = get_database()
    appointments = []
    async for doc in db[APPOINTMENTS_COLLECTION].find({}).sort("created_at", -1):
        appointments.append(_serialize(doc))
    return appointments


async def update_appointment_status(
    appointment_id: str,
    data: AppointmentStatusUpdate,
) -> Optional[dict]:
    db = get_database()
    object_id = _object_id(appointment_id)
    result = await db[APPOINTMENTS_COLLECTION].update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": data.status,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    if result.matched_count == 0:
        return None

    doc = await db[APPOINTMENTS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None
