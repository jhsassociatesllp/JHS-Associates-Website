from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status

from app.auth.deps import require_roles
from app.controllers import career as career_ctrl
from app.schemas.admin import AdminInDB, AdminRole
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
async def submit_application(data: ApplicationCreate):
    try:
        application = await career_ctrl.create_application(data)
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
    how_heard: str = Form(...),
    how_heard_detail: Optional[str] = Form(None),
    resume: UploadFile = File(...),
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Resume must be a PDF file")

    resume_bytes = await resume.read()
    if len(resume_bytes) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume PDF must be 8 MB or smaller")

    data = ApplicationCreate(
        job_id=job_id or None,
        full_name=full_name,
        email=email,
        phone=phone,
        current_location=current_location,
        experience_years=experience_years,
        cover_letter=cover_letter,
        place_of_residence=place_of_residence,
        highest_qualification=highest_qualification,
        highest_qualification_other=highest_qualification_other,
        profile=profile,
        profile_other=profile_other,
        how_heard=how_heard,
        how_heard_detail=how_heard_detail,
    )

    try:
        application = await career_ctrl.create_application_with_resume(
            data,
            resume_filename=resume.filename or "resume.pdf",
            resume_content_type=resume.content_type,
            resume_bytes=resume_bytes,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    if not application:
        raise HTTPException(status_code=404, detail="Open job not found")
    return application


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
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )
