from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal, Optional
from datetime import datetime

from app.utils.validation import Email, FormGuard, Message, Name, Phone, ShortText, Subject, optional_blank_to_none

InquiryReason = Literal[
    "I have an interesting news", "Request for services", "Partnership opportunity", "General inquiry", "Other",
]


class ProposalCreate(FormGuard):
    first_name: Name
    last_name: ShortText
    email: Email
    phone: Optional[Phone] = None
    inquiry_reason: InquiryReason
    subject: Subject
    message: Message

    @field_validator("phone", mode="before")
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)

class ProposalResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    inquiry_reason: str
    subject: str
    message: Optional[str] = None
    user_id: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True
