import asyncio
import logging
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
from app.services import ats
from app.services.email_service import notify_hr_new_application

logger = logging.getLogger(__name__)

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


ATS_TIMEOUT_SECONDS = 15


async def score_resume_bytes(resume_bytes: bytes, job: Optional[dict], declared_profile: Optional[str] = None) -> dict:
    """Extracts the resume text and scores it against `job`. Never raises: a resume that can't be read
    (scanned, encrypted, corrupt, too slow) comes back as status "unreadable" for manual review."""
    if not job:
        return {"score": None, "status": "not_applicable", "match": None, "threshold": ats.MATCH_THRESHOLD,
                "components": {}, "matched_keywords": [], "missing_keywords": [], "experience_years": None,
                "flags": ["General application — no vacancy to match against."], "scored_at": datetime.now(timezone.utc)}

    def work() -> dict:
        text, _pages = ats.extract_pdf_text(resume_bytes)
        return ats.score_resume(text, job, declared_profile)

    try:
        # PDF parsing is CPU-bound: keep it off the event loop and bound its time.
        return await asyncio.wait_for(asyncio.to_thread(work), timeout=ATS_TIMEOUT_SECONDS)
    except (ValueError, asyncio.TimeoutError, Exception) as exc:  # noqa: BLE001
        logger.warning("ATS scoring could not read resume: %s", exc)
        return {"score": 0, "status": "unreadable", "match": False, "threshold": ats.MATCH_THRESHOLD,
                "components": {}, "matched_keywords": [], "missing_keywords": [], "experience_years": None,
                "flags": ["The resume could not be read (corrupt, password-protected or image-only). Review it manually."],
                "scored_at": datetime.now(timezone.utc)}


def _ats_fields(result: dict) -> dict:
    """What gets stored on the application document."""
    return {
        "ats_score": result["score"],
        "ats_status": result["status"],
        "ats_match": result["match"],
        "ats_scored_at": result["scored_at"],
        "ats_details": {
            "threshold": result["threshold"],
            "components": result["components"],
            "matched_keywords": result["matched_keywords"],
            "missing_keywords": result["missing_keywords"],
            "experience_years": result["experience_years"],
            "flags": result["flags"],
        },
    }


_ATS_GROUP = {"matched": 0, "below": 1, "unreadable": 2, "not_applicable": 3}


def _ats_sort_key(doc: dict):
    status = doc.get("ats_status")
    group = _ATS_GROUP.get(status, 4)  # not scored yet (older applications) go last
    return (group, -(doc.get("ats_score") or 0), -(doc["created_at"].timestamp() if doc.get("created_at") else 0))


async def create_application(data: ApplicationCreate, applicant: Optional[dict] = None) -> Optional[dict]:
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
    if applicant:
        payload["applicant_id"] = applicant["id"]
        payload["email"] = applicant["email"]

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
    applicant: Optional[dict] = None,
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
    if applicant:
        payload["applicant_id"] = applicant["id"]
        payload["email"] = applicant["email"]

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

    # ATS: score the resume against the vacancy (server-side, so it can't be forged by the client)
    payload.update(_ats_fields(await score_resume_bytes(resume_bytes, job, data.profile)))

    result = await db[APPLICATIONS_COLLECTION].insert_one(payload)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_application(payload, job["title"] if job else "General Application")

    created = await db[APPLICATIONS_COLLECTION].find_one({"_id": result.inserted_id})
    return _serialize(created)


async def list_applications(job_id: Optional[str] = None) -> list[dict]:
    db = get_database()
    query = {"job_id": job_id} if job_id else {}
    applications = []
    async for doc in db[APPLICATIONS_COLLECTION].find(query):
        applications.append(doc)
    # Best ATS matches first (60%+ by score), then the rest, then unreadable resumes,
    # then applications with no vacancy; newest first within equal scores.
    applications.sort(key=_ats_sort_key)
    return [_serialize(d) for d in applications]


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


# ── Re-scoring (job description / keywords changed, or older unscored applications) ──

async def _read_resume_bytes(application: dict) -> Optional[bytes]:
    if not application.get("resume_file_id"):
        return None
    try:
        bucket = AsyncIOMotorGridFSBucket(get_database(), bucket_name=RESUME_BUCKET)
        grid_out = await bucket.open_download_stream(_object_id(application["resume_file_id"]))
        return await grid_out.read()
    except Exception:  # noqa: BLE001
        return None


async def rescore_application_doc(application: dict) -> dict:
    db = get_database()
    job = None
    if application.get("job_id"):
        try:
            job = await get_job(application["job_id"], include_all=True)
        except ValueError:
            job = None
    contents = await _read_resume_bytes(application)
    if contents is None:
        result = await score_resume_bytes(b"", job, application.get("profile")) if job else await score_resume_bytes(b"", None)
    else:
        result = await score_resume_bytes(contents, job, application.get("profile"))
    fields = _ats_fields(result)
    await db[APPLICATIONS_COLLECTION].update_one({"_id": application["_id"]}, {"$set": fields})
    return {**application, **fields}


async def rescore_application(application_id: str) -> Optional[dict]:
    db = get_database()
    doc = await db[APPLICATIONS_COLLECTION].find_one({"_id": _object_id(application_id)})
    if not doc:
        return None
    return _serialize(await rescore_application_doc(doc))


async def rescore_applications(job_id: Optional[str] = None, only_unscored: bool = False) -> int:
    """Re-scores the applications of one vacancy, or (only_unscored) everything not scored yet."""
    db = get_database()
    query: dict = {}
    if job_id:
        query["job_id"] = job_id
    if only_unscored:
        query["ats_status"] = {"$exists": False}
    count = 0
    async for doc in db[APPLICATIONS_COLLECTION].find(query):
        await rescore_application_doc(doc)
        count += 1
    return count
