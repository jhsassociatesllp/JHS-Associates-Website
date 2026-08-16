from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.database.connection import get_database
from app.schemas.career import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    JobCreate,
    JobUpdate,
)
from app.services.email_service import notify_hr_new_application

JOBS_COLLECTION = "career_jobs"
APPLICATIONS_COLLECTION = "career_applications"
RESUME_BUCKET = "career_resumes"


def _object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise ValueError("Invalid id")


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def create_job(data: JobCreate, created_by: Optional[str] = None) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    payload["created_at"] = now
    payload["updated_at"] = now
    payload["created_by"] = created_by

    result = await db[JOBS_COLLECTION].insert_one(payload)
    created = await db[JOBS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def list_jobs(include_all: bool = False) -> list[dict]:
    db = get_database()
    query = {} if include_all else {"status": "open"}
    jobs = []
    async for doc in db[JOBS_COLLECTION].find(query).sort("created_at", -1):
        jobs.append(_serialize(doc))
    return jobs


async def get_job(job_id: str, include_all: bool = False) -> Optional[dict]:
    db = get_database()
    query = {"_id": _object_id(job_id)}
    if not include_all:
        query["status"] = "open"

    doc = await db[JOBS_COLLECTION].find_one(query)
    return _serialize(doc) if doc else None


async def update_job(job_id: str, data: JobUpdate) -> Optional[dict]:
    db = get_database()
    payload = data.model_dump(exclude_unset=True)
    if not payload:
        return await get_job(job_id, include_all=True)

    payload["updated_at"] = datetime.now(timezone.utc)
    result = await db[JOBS_COLLECTION].update_one(
        {"_id": _object_id(job_id)},
        {"$set": payload},
    )
    if result.matched_count == 0:
        return None

    return await get_job(job_id, include_all=True)


async def delete_job(job_id: str) -> bool:
    db = get_database()
    result = await db[JOBS_COLLECTION].delete_one({"_id": _object_id(job_id)})
    return result.deleted_count == 1


async def create_application(data: ApplicationCreate) -> Optional[dict]:
    db = get_database()
    job = await get_job(data.job_id, include_all=False) if data.job_id else None
    if data.job_id and not job:
        return None

    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    payload["job_title"] = job["title"] if job else None
    payload["status"] = "new"
    payload["created_at"] = now
    payload["updated_at"] = now

    result = await db[APPLICATIONS_COLLECTION].insert_one(payload)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_application(payload, job["title"] if job else "General Application")

    created = await db[APPLICATIONS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def create_application_with_resume(
    data: ApplicationCreate,
    resume_filename: str,
    resume_content_type: str,
    resume_bytes: bytes,
) -> Optional[dict]:
    db = get_database()
    job = await get_job(data.job_id, include_all=False) if data.job_id else None
    if data.job_id and not job:
        return None

    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    payload["job_title"] = job["title"] if job else None
    payload["status"] = "new"
    payload["created_at"] = now
    payload["updated_at"] = now

    bucket = AsyncIOMotorGridFSBucket(db, bucket_name=RESUME_BUCKET)
    file_id = await bucket.upload_from_stream(
        resume_filename,
        resume_bytes,
        metadata={
            "job_id": data.job_id,
            "job_title": job["title"] if job else None,
            "candidate_email": data.email,
            "content_type": resume_content_type,
            "uploaded_at": now,
        },
    )

    payload["resume_file_id"] = str(file_id)
    payload["resume_filename"] = resume_filename
    payload["resume_content_type"] = resume_content_type
    payload["resume_size"] = len(resume_bytes)

    result = await db[APPLICATIONS_COLLECTION].insert_one(payload)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_application(payload, job["title"] if job else "General Application")

    created = await db[APPLICATIONS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def list_applications(job_id: Optional[str] = None) -> list[dict]:
    db = get_database()
    query = {"job_id": job_id} if job_id else {}
    applications = []
    async for doc in db[APPLICATIONS_COLLECTION].find(query).sort("created_at", -1):
        applications.append(_serialize(doc))
    return applications


async def update_application_status(
    application_id: str,
    data: ApplicationStatusUpdate,
) -> Optional[dict]:
    db = get_database()
    object_id = _object_id(application_id)
    result = await db[APPLICATIONS_COLLECTION].update_one(
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

    doc = await db[APPLICATIONS_COLLECTION].find_one({"_id": object_id})
    return _serialize(doc) if doc else None


async def get_application_resume(application_id: str) -> Optional[dict]:
    db = get_database()
    application = await db[APPLICATIONS_COLLECTION].find_one({"_id": _object_id(application_id)})
    if not application or not application.get("resume_file_id"):
        return None

    bucket = AsyncIOMotorGridFSBucket(db, bucket_name=RESUME_BUCKET)
    grid_out = await bucket.open_download_stream(_object_id(application["resume_file_id"]))
    contents = await grid_out.read()

    return {
        "contents": contents,
        "filename": application.get("resume_filename") or grid_out.filename or "resume.pdf",
        "content_type": application.get("resume_content_type") or "application/pdf",
    }
