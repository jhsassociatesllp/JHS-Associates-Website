from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.deps import get_current_consulting_user, get_current_user, require_roles
from app.auth.security import create_access_token
from app.controllers import applicant as applicant_ctrl
from app.controllers import consultation as consultation_ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.applicant import GoogleAuthRequest
from app.schemas.consultation import (
    ConsultationRequestCreate,
    ConsultationRequestResponse,
    ConsultationRequestStatusUpdate,
    ConsultingGoogleAuthResponse,
    ConsultingUserResponse,
)

router = APIRouter(prefix="/consulting", tags=["Consulting"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])
CONSULTING_TOKEN_EXPIRES = timedelta(days=30)


@router.post("/auth/google", response_model=ConsultingGoogleAuthResponse)
async def consulting_google_signin(data: GoogleAuthRequest):
    google_payload = applicant_ctrl.verify_google_credential(data.credential)
    user = await consultation_ctrl.upsert_consulting_user_from_google(google_payload)

    token = create_access_token(
        {"sub": user["email"], "uid": user["id"], "type": "consulting_user"},
        expires_delta=CONSULTING_TOKEN_EXPIRES,
    )
    return {"token": token, "user": user}


@router.get("/me", response_model=ConsultingUserResponse)
async def consulting_current_user(user: dict = Depends(get_current_consulting_user)):
    """Lets the frontend proactively check whether a stored session token is
    still valid (and the account still active) — e.g. on page load — rather
    than only discovering an expired/revoked session when a submit fails."""
    return user


@router.post(
    "/requests",
    response_model=ConsultationRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_consultation_request(
    data: ConsultationRequestCreate,
    user: dict = Depends(get_current_user),
):
    return await consultation_ctrl.create_consultation_request(data, user)


@router.get("/admin/requests", response_model=list[ConsultationRequestResponse])
async def admin_list_consultation_requests(current_admin: AdminInDB = Depends(hr_access)):
    return await consultation_ctrl.list_consultation_requests()


@router.patch("/admin/requests/{request_id}/status", response_model=ConsultationRequestResponse)
async def admin_update_consultation_request_status(
    request_id: str,
    data: ConsultationRequestStatusUpdate,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        updated = await consultation_ctrl.update_consultation_request_status(request_id, data.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request id")

    if not updated:
        raise HTTPException(status_code=404, detail="Consultation request not found")
    return updated
