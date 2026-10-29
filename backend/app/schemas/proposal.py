from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal, Optional
from datetime import datetime

from app.utils.validation import Email, FormGuard, Message, Name, Phone, ShortText, Subject, _no_markup, optional_blank_to_none

InquiryReason = Literal[
    "I have an interesting news", "Request for services", "Partnership opportunity", "General inquiry", "Other",
]

# Where a request is in the follow-up: set by the team in the admin panel (new requests start as "new")
ProposalStatus = Literal["new", "in_review", "proposal_sent", "closed"]


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
    # follow-up tracking (set by the team)
    status: ProposalStatus = "new"
    admin_note: Optional[str] = None
    handled_by: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


class ProposalStatusUpdate(BaseModel):
    status: ProposalStatus
    note: Optional[str] = Field(None, max_length=1000)

    @field_validator("note")
    @classmethod
    def _plain_note(cls, v):
        v = (v or "").strip()
        return _no_markup(v) if v else None
