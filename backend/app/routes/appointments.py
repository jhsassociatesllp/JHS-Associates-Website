from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.deps import get_current_user, require_roles
from app.controllers import appointment as appointment_ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])


@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def submit_appointment(data: AppointmentCreate, user: dict = Depends(get_current_user)):
    return await appointment_ctrl.create_appointment(data, user)


@router.get("/admin", response_model=list[AppointmentResponse])
async def admin_list_appointments(current_admin: AdminInDB = Depends(hr_access)):
    return await appointment_ctrl.list_appointments()


@router.patch("/admin/{appointment_id}/status", response_model=AppointmentResponse)
async def admin_update_appointment_status(
    appointment_id: str,
    data: AppointmentStatusUpdate,
    current_admin: AdminInDB = Depends(hr_access),
):
    try:
        appointment = await appointment_ctrl.update_appointment_status(appointment_id, data)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid appointment id")

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment
