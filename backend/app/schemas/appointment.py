from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

AppointmentStatus = Literal["new", "confirmed", "completed", "cancelled"]
# Where a booking started. A fixed list so the data stays clean and nobody can inject free text.
BookingSource = Literal["book_appointment_page", "services_card", "partner_card"]


def clean_source_page(value: Optional[str]) -> Optional[str]:
    """Keep only a plain site path like /services/taxation (no query, no hostnames)."""
    if not value:
        return None
    value = value.split("?")[0].split("#")[0].strip()
    if not value.startswith("/") or value.startswith("//") or len(value) > 200:
        return None
    if not all(c.isalnum() or c in "/-_.%" for c in value):
        return None
    return value


class AppointmentCreate(BaseModel):
    mobile: str = Field(..., min_length=7, max_length=15)
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    city: Optional[str] = Field(None, max_length=120)
    message: Optional[str] = Field(None, max_length=2000)
    speciality: str = Field(..., min_length=2, max_length=120)
    partner: Optional[str] = Field(None, max_length=120)
    date: Optional[str] = Field(None, max_length=40)   # no longer asked for; kept so old records still load
    time: Optional[str] = Field(None, max_length=40)
    source: BookingSource = "book_appointment_page"
    source_page: Optional[str] = Field(None, max_length=200)

    @field_validator("source_page")
    @classmethod
    def _page(cls, v):
        return clean_source_page(v)


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(AppointmentCreate):
    id: str
    status: AppointmentStatus
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
