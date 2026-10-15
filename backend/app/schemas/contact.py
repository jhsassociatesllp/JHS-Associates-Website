from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal, Optional
from datetime import datetime

from app.utils.validation import Email, FormGuard, Name, Phone, ShortText, _text, optional_blank_to_none

ContactService = Literal[
    "Audit & Assurance", "Taxation Services", "Consulting", "Outsourcing",
    "SOC Attestation", "Single Window Assistance", "Other",
]


class ContactCreate(FormGuard):
    name: Name
    email: Email
    phone: Optional[Phone] = None
    company: Optional[ShortText] = None
    service: Optional[ContactService] = None
    message: _text(10, 1000)

    @field_validator("phone", "company", "service", mode="before")
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)

class ContactResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        populate_by_name = True
