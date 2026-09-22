from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

ConsultationStatus = Literal["new", "confirmed", "completed", "cancelled"]


class ConsultingUserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    google_id: Optional[str] = None
    auth_provider: str = "google"
    is_verified: bool = False
    status: str = "active"
    created_at: datetime
    last_login: Optional[datetime] = None


class ConsultingGoogleAuthResponse(BaseModel):
    token: str
    user: ConsultingUserResponse


class ConsultationRequestCreate(BaseModel):
    partner_name: str = Field(..., min_length=2, max_length=120)
    partner_role: Optional[str] = Field(None, max_length=120)
    partner_location: Optional[str] = Field(None, max_length=120)
    appointment_type: str = Field(..., min_length=2, max_length=160)
    message: Optional[str] = Field(None, max_length=2000)


class ConsultationRequestStatusUpdate(BaseModel):
    status: ConsultationStatus


class ConsultationRequestResponse(ConsultationRequestCreate):
    id: str
    status: ConsultationStatus
    user_name: str
    user_email: EmailStr
    user_picture: Optional[str] = None
    created_at: datetime
    updated_at: datetime
