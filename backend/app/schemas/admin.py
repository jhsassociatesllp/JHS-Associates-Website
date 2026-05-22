from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from enum import Enum

class AdminRole(str, Enum):
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"
    HR_ADMIN = "hr_admin"

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    role: AdminRole
    name: str

class AdminInDB(BaseModel):
    id: str
    email: str
    password: str
    role: AdminRole
    name: str
    created_at: Optional[str] = None
    last_login: Optional[str] = None

class AdminResponse(BaseModel):
    id: str
    email: str
    role: AdminRole
    name: str
    last_login: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[AdminRole] = None
