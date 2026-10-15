from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

from app.utils.validation import Email, FormGuard, Name, Phone, _text, optional_blank_to_none


class AlumniCreate(FormGuard):
    first_name: Name
    last_name: Name
    email: Email
    phone: Optional[Phone] = None
    company: _text(2, 100)
    designation: _text(2, 100)
    tenure: _text(2, 50)
    last_role: _text(2, 100)
    message: Optional[_text(1, 2000)] = None

    @field_validator("phone", "message", mode="before")
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)

class AlumniResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    company: str
    designation: str
    tenure: str
    last_role: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True
