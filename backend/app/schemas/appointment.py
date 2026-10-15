from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.utils.validation import Email, FormGuard, Name, ShortText, _text, optional_blank_to_none

Speciality = Literal[
    "Assurance", "Consulting", "IT Assurance", "Taxation", "Outsourcing", "Corporate Finance",
    "Learning & Development", "Compliance & Governance", "Single Window Assistance", "SOC Attestation",
]
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


class AppointmentCreate(FormGuard):
    mobile: str = Field(..., pattern=r"^[6-9]\d{9}$")
    full_name: _text(2, 120)
    email: Email
    city: Optional[ShortText] = None
    message: Optional[_text(1, 2000)] = None
    speciality: Speciality
    partner: Optional[_text(1, 120)] = None
    date: Optional[str] = Field(None, max_length=40)   # no longer asked for; kept so old records still load
    time: Optional[str] = Field(None, max_length=40)
    source: BookingSource = "book_appointment_page"
    source_page: Optional[str] = Field(None, max_length=200)

    @field_validator("city", "message", "partner", mode="before")
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)

    @field_validator("source_page")
    @classmethod
    def _page(cls, v):
        return clean_source_page(v)


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(BaseModel):
    id: str
    reference: Optional[str] = None
    mobile: str
    full_name: str
    email: str
    city: Optional[str] = None
    message: Optional[str] = None
    speciality: str
    partner: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    source: Optional[str] = None
    source_page: Optional[str] = None
    status: AppointmentStatus
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
