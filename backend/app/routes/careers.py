import os
import re
import time
from collections import defaultdict, deque
from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, Response, UploadFile, status
from pydantic import ValidationError

from app.auth.deps import get_current_applicant, get_current_user, require_roles
from app.auth.security import create_access_token
from app.controllers import applicant as applicant_ctrl
from app.controllers import career as career_ctrl
from app.controllers import career_export as export_ctrl
from app.services import ats
from app.utils.validation import FormGuard, guard_form
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.applicant import ApplicantResponse, GoogleAuthRequest, GoogleAuthResponse
from app.schemas.career import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
    JobCreate,
    JobResponse,
    JobUpdate,
)

router = APIRouter(prefix="/careers", tags=["Careers"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])
MAX_RESUME_SIZE = 8 * 1024 * 1024
APPLICANT_TOKEN_EXPIRES = timedelta(hours=24)

# ── Resume upload hygiene ─────────────────────────────────────────────────
def _safe_filename(name: Optional[str]) -> str:
    """Strip any path, control characters and odd symbols from a client-supplied file name."""
    base = os.path.basename((name or "resume.pdf").replace("\\", "/"))
    base = re.sub(r"[^\w.\- ]+", "_", base).strip(" ._") or "resume.pdf"
    if not base.lower().endswith(".pdf"):
        base += ".pdf"
    return base[:120]


_PDF_ACTIVE = re.compile(rb"/(JavaScript|JS|Launch|EmbeddedFile|RichMedia)(?![A-Za-z0-9])")
MAX_PDF_PAGES = 30


def _validate_pdf(content_type: Optional[str], data: bytes) -> None:
    """Content-Type is client-controlled, so the file's own signature is checked too."""
    if content_type != "application/pdf" or not data.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="Resume must be a PDF file")
    if len(data) < 100:
        raise HTTPException(status_code=400, detail="Resume PDF is empty or damaged")
    if len(data) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume PDF must be 8 MB or smaller")
    if _PDF_ACTIVE.search(data):
        raise HTTPException(status_code=400, detail="Resume PDF must not contain scripts or attachments")
    try:
        from io import BytesIO
        from pypdf import PdfReader
        pages = len(PdfReader(BytesIO(data), strict=False).pages)
    except Exception:
        return   # unreadable text is handled by the ATS ("review manually"); not a reason to refuse
    if pages > MAX_PDF_PAGES:
        raise HTTPException(status_code=400, detail=f"Resume PDF must have {MAX_PDF_PAGES} pages or fewer")


# ── Rate limit for the pre-submit resume check (PDF parsing is not free) ──
_CHECK_WINDOW = 3600
_CHECK_MAX = 10
_check_hits: dict[str, deque] = defaultdict(deque)


def _check_rate(user_id: str) -> None:
    now = time.monotonic()
    q = _check_hits[user_id]
    while q and now - q[0] > _CHECK_WINDOW:
        q.popleft()
    if len(q) >= _CHECK_MAX:
        raise HTTPException(status_code=429, detail="Too many resume checks. Please try again later.")
    q.append(now)


@router.post("/auth/google", response_model=GoogleAuthResponse)
async def careers_google_signin(data: GoogleAuthRequest):
    google_payload = applicant_ctrl.verify_google_credential(data.credential)
    applicant = await applicant_ctrl.upsert_applicant_from_google(google_payload)

    token = create_access_token(
        {"sub": applicant["email"], "uid": applicant["id"], "type": "applicant"},
        expires_delta=APPLICANT_TOKEN_EXPIRES,
    )
    return {"token": token, "applicant": applicant}


@router.get("/me", response_model=ApplicantResponse)
async def careers_current_applicant(applicant: dict = Depends(get_current_applicant)):
    """Lets the frontend proactively check whether a stored session token is
    still valid (and the account still active) — e.g. on page load — rather
    than only discovering an expired/revoked session when a submit fails."""
    return applicant


@router.get("/jobs", response_model=list[JobResponse])
async def public_jobs():
    return await career_ctrl.list_jobs(include_all=False)


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def public_job_detail(job_id: str):
    try:
        job = await career_ctrl.get_job(job_id, include_all=False)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post(
    "/applications",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_application(
    data: ApplicationCreate,
    applicant: dict = Depends(get_current_user),
):
    try:
        application = await career_ctrl.create_application(data, applicant=applicant)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not application:
        raise HTTPException(status_code=404, detail="Open job not found")
    return application


@router.post(
    "/applications/upload",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_application_with_resume(
    request: Request,
    job_id: Optional[str] = Form(None),
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    current_location: Optional[str] = Form(None),
    experience_years: Optional[str] = Form(None),
    cover_letter: Optional[str] = Form(None),
    place_of_residence: Optional[str] = Form(None),
    highest_qualification: str = Form(...),
    highest_qualification_other: Optional[str] = Form(None),
    profile: str = Form(...),
    profile_other: Optional[str] = Form(None),
    current_ctc: Optional[str] = Form(None),
    expected_ctc: Optional[str] = Form(None),
    how_heard: str = Form(...),
    how_heard_detail: Optional[str] = Form(None),
    consent: bool = Form(False),
    website: Optional[str] = Form(None),
    cf_turnstile_token: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    applicant: dict = Depends(get_current_user),
):
    # Check every text field BEFORE reading the file or touching the database, and answer 422 (never 500).
    try:
        data = ApplicationCreate(
            job_id=job_id, full_name=full_name, email=email, phone=phone,
            current_location=current_location, experience_years=experience_years, cover_letter=cover_letter,
            place_of_residence=place_of_residence, highest_qualification=highest_qualification,
            highest_qualification_other=highest_qualification_other, profile=profile, profile_other=profile_other,
            current_ctc=current_ctc, expected_ctc=expected_ctc, how_heard=how_heard,
            how_heard_detail=how_heard_detail, consent=consent,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=[{"loc": list(e["loc"]), "msg": e["msg"].replace("Value error, ", "")} for e in exc.errors()])
    await guard_form(request, FormGuard(website=website, cf_turnstile_token=cf_turnstile_token, consent=True), "careers", per_hour=20, per_minute=5)

    if not (resume.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Resume must be a PDF file (name ending in .pdf)")
    resume_bytes = await resume.read(MAX_RESUME_SIZE + 1)
    _validate_pdf(resume.content_type, resume_bytes)

    try:
        application = await career_ctrl.create_application_with_resume(
            data,
            resume_filename=_safe_filename(resume.filename),
            resume_content_type=resume.content_type,
            resume_bytes=resume_bytes,
            applicant=applicant,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not application:
        raise HTTPException(status_code=404, detail="Open job not found")
    return application


@router.post("/ats-check")
async def ats_resume_check(
    job_id: str = Form(...),
    resume: UploadFile = File(...),
    applicant: dict = Depends(get_current_user),
):
    """Pre-submit check for candidates: how well does this resume match the vacancy?
    Nothing is stored. Returns guidance only; the stored score is computed again on submit."""
    _check_rate(str(applicant["id"]))
    data = await resume.read(MAX_RESUME_SIZE + 1)
    _validate_pdf(resume.content_type, data)
    try:
        job = await career_ctrl.get_job(job_id, include_all=False)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")
    if not job:
        raise HTTPException(status_code=404, detail="Open job not found")

    result = await career_ctrl.score_resume_bytes(data, job)
    return {
        "score": result["score"],
        "status": result["status"],
        "match": result["match"],
        "threshold": result["threshold"],
        "components": result["components"],
        "matched_keywords": result["matched_keywords"][:12],
        "missing_keywords": result["missing_keywords"][:8],
        "tips": ats.candidate_tips(result),
    }


@router.get("/admin/jobs", response_model=list[JobResponse])
async def admin_jobs(current_admin: AdminInDB = Depends(hr_access)):
    return await career_ctrl.list_jobs(include_all=True)


@router.post(
    "/admin/jobs",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_job(
    data: JobCreate,
    current_admin: AdminInDB = Depends(hr_access),
):
    return await career_ctrl.create_job(data, created_by=current_admin.email)


@router.put("/admin/jobs/{job_id}", response_model=JobResponse)
async def admin_update_job(
    job_id: str,
    data: JobUpdate,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        job = await career_ctrl.update_job(job_id, data)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.delete("/admin/jobs/{job_id}")
async def admin_delete_job(
    job_id: str,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        deleted = await career_ctrl.delete_job(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}


@router.get("/admin/applications", response_model=list[ApplicationResponse])
async def admin_applications(
    job_id: Optional[str] = None,
    current_admin: AdminInDB = Depends(hr_access),
):
    return await career_ctrl.list_applications(job_id=job_id)


@router.get("/admin/applications/export")
async def admin_export_applications(
    date_from: Optional[str] = Query(None, max_length=10),
    date_to: Optional[str] = Query(None, max_length=10),
    job_id: Optional[str] = Query(None, max_length=40),
    profile: Optional[str] = Query(None, max_length=60),
    what: str = Query("zip", pattern="^(zip|report)$"),
    current_admin: AdminInDB = Depends(hr_access),
):
    """Résumés + report for the days chosen. what=zip -> one folder with every résumé; what=report -> just the sheet."""
    try:
        day_from, day_to = export_ctrl.parse_day(date_from), export_ctrl.parse_day(date_to)
        docs = await export_ctrl.load_applications(day_from, day_to, job_id, profile)
        label = export_ctrl.label_for(day_from, day_to, profile)
        if what == "report":
            body, media, fname = await export_ctrl.report_xlsx(docs, label), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", f"JHS_Tracker_{label}.xlsx"
        else:
            body, media, fname = await export_ctrl.build_zip(docs, label), "application/zip", f"JHS_Resumes_{label}.zip"
    except export_ctrl.ExportError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    return Response(content=body, media_type=media, headers={
        "Content-Disposition": f'attachment; filename="{fname}"', "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
        "X-Application-Count": str(len(docs)),
    })


@router.patch(
    "/admin/applications/{application_id}/status",
    response_model=ApplicationResponse,
)
async def admin_update_application_status(
    application_id: str,
    data: ApplicationStatusUpdate,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        application = await career_ctrl.update_application_status(application_id, data)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid application id")

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.get("/admin/applications/{application_id}/resume")
async def admin_application_resume(
    application_id: str,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        resume = await career_ctrl.get_application_resume(application_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid application id")

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    filename = resume["filename"].replace('"', "")
    return Response(
        content=resume["contents"],
        media_type=resume["content_type"],
        headers={"Content-Disposition": f'attachment; filename="{filename}"', "X-Content-Type-Options": "nosniff"},
    )


# ── ATS re-scoring (admin) ───────────────────────────────────────────────────

@router.post("/admin/applications/rescore-unscored")
async def admin_rescore_unscored(current_admin: AdminInDB = Depends(hr_access)):
    """Scores applications that were submitted before the ATS existed."""
    return {"rescored": await career_ctrl.rescore_applications(only_unscored=True)}


@router.post("/admin/jobs/{job_id}/rescore")
async def admin_rescore_job(job_id: str, current_admin: AdminInDB = Depends(hr_access)):
    """Re-scores every application of a vacancy (e.g. after its description / keywords changed)."""
    try:
        job = await career_ctrl.get_job(job_id, include_all=True)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"rescored": await career_ctrl.rescore_applications(job_id=job_id)}


@router.post("/admin/applications/{application_id}/rescore", response_model=ApplicationResponse)
async def admin_rescore_application(application_id: str, current_admin: AdminInDB = Depends(hr_access)):
    try:
        application = await career_ctrl.rescore_application(application_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid application id")
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
