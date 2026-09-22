from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.deps import require_roles
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.alumni import AlumniCreate, AlumniResponse
from app.controllers.alumni import create_alumni_registration, get_all_alumni
from typing import List

router = APIRouter(prefix="/alumni", tags=["Alumni"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])

@router.post("/", response_model=AlumniResponse, status_code=status.HTTP_201_CREATED)
async def submit_alumni(alumni: AlumniCreate):
    try:
        result = await create_alumni_registration(alumni)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit alumni registration"
        )

@router.get("/", response_model=List[AlumniResponse])
async def list_alumni(current_admin: AdminInDB = Depends(hr_access)):
    try:
        alumni_list = await get_all_alumni()
        return alumni_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve alumni registrations"
        )
