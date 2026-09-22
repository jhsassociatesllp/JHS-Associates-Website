from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class GoogleAuthRequest(BaseModel):
    credential: str


class ApplicantResponse(BaseModel):
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


class GoogleAuthResponse(BaseModel):
    token: str
    applicant: ApplicantResponse
