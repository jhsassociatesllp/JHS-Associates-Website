from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

AppointmentStatus = Literal["new", "confirmed", "completed", "cancelled"]


class AppointmentCreate(BaseModel):
    mobile: str = Field(..., min_length=7, max_length=15)
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    city: Optional[str] = Field(None, max_length=120)
    message: Optional[str] = Field(None, max_length=2000)
    speciality: str = Field(..., min_length=2, max_length=120)
    partner: Optional[str] = Field(None, max_length=120)
    date: str
    time: str


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(AppointmentCreate):
    id: str
    status: AppointmentStatus
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
