from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    agree_terms: bool

    def full_name(self) -> str:
        return f"{self.first_name.strip()} {self.last_name.strip()}".strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str


class UserResponse(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    name: str
    email: EmailStr
    picture: Optional[str] = None
    google_id: Optional[str] = None
    auth_provider: str = "password"
    is_verified: bool = False
    status: str = "active"
    created_at: datetime
    last_login: Optional[datetime] = None


class AuthResponse(BaseModel):
    token: str
    user: UserResponse
