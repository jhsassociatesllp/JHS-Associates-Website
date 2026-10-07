from datetime import datetime
from typing import Literal, Optional
from urllib.parse import urlparse

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

EventType = Literal["Excellencia", "Knowledge Setu", "Office Event", "Webinar", "Other"]
EventMode = Literal["Online", "In-person", "Hybrid"]
EventStatus = Literal["draft", "published", "cancelled"]
EventState = Literal["upcoming", "live", "past"]


def _http_url(value: Optional[str]) -> Optional[str]:
    """Only plain http(s) links are accepted (blocks javascript:, data:, file: …)."""
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("Link must start with http:// or https://")
    return value[:500]


class EventBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=160)
    event_type: EventType = "Excellencia"
    summary: str = Field("", max_length=300)
    description: str = Field("", max_length=4000)
    start_at: datetime
    end_at: Optional[datetime] = None
    mode: EventMode = "Online"
    venue: Optional[str] = Field(None, max_length=300)
    # Private: only revealed to people who register (never in the public listing).
    join_link: Optional[str] = Field(None, max_length=500)
    # If set, "Register" opens this link instead of our own form (not tracked here).
    external_registration_url: Optional[str] = Field(None, max_length=500)
    capacity: int = Field(0, ge=0, le=100000)  # 0 = unlimited
    registration_deadline: Optional[datetime] = None
    host: Optional[str] = Field(None, max_length=160)
    status: EventStatus = "published"

    @field_validator("join_link", "external_registration_url")
    @classmethod
    def _links(cls, v):
        return _http_url(v)

    @model_validator(mode="after")
    def _times(self):
        if self.end_at and self.end_at <= self.start_at:
            raise ValueError("End time must be after the start time")
        return self


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=160)
    event_type: Optional[EventType] = None
    summary: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = Field(None, max_length=4000)
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    mode: Optional[EventMode] = None
    venue: Optional[str] = Field(None, max_length=300)
    join_link: Optional[str] = Field(None, max_length=500)
    external_registration_url: Optional[str] = Field(None, max_length=500)
    capacity: Optional[int] = Field(None, ge=0, le=100000)
    registration_deadline: Optional[datetime] = None
    host: Optional[str] = Field(None, max_length=160)
    status: Optional[EventStatus] = None

    @field_validator("join_link", "external_registration_url")
    @classmethod
    def _links(cls, v):
        return _http_url(v)


class EventPublic(BaseModel):
    id: str
    title: str
    event_type: str
    summary: str = ""
    description: str = ""
    start_at: datetime
    end_at: datetime
    mode: str
    venue: Optional[str] = None
    external_registration_url: Optional[str] = None
    capacity: int = 0
    registered: int = 0
    spots_left: Optional[int] = None
    registration_deadline: Optional[datetime] = None
    host: Optional[str] = None
    state: EventState
    registration_open: bool


class EventAdmin(EventPublic):
    join_link: Optional[str] = None
    status: EventStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RegistrationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., pattern=r"^\+?[0-9][0-9\s\-()]{6,19}$")
    organization: Optional[str] = Field(None, max_length=120)
    designation: Optional[str] = Field(None, max_length=120)
    city: Optional[str] = Field(None, max_length=80)
    consent: bool
    # Honeypot: hidden in the form; real visitors leave it empty, bots fill it in.
    website: str = Field("", max_length=200)

    @field_validator("name", "organization", "designation", "city")
    @classmethod
    def _squash(cls, v):
        return " ".join(v.split()) if isinstance(v, str) else v

    @field_validator("consent")
    @classmethod
    def _must_consent(cls, v):
        if not v:
            raise ValueError("Consent is required")
        return v


class RegistrationResult(BaseModel):
    message: str
    reference: str
    event: EventPublic
    join_link: Optional[str] = None


class RegistrationAdmin(BaseModel):
    id: str
    event_id: str
    name: str
    email: str
    phone: str
    organization: Optional[str] = None
    designation: Optional[str] = None
    city: Optional[str] = None
    attended: bool = False
    created_at: datetime
