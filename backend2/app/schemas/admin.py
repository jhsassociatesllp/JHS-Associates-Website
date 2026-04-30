from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminInDB(BaseModel):
    id: str
    emails: list[str]
    password: str

class AdminResponse(BaseModel):
    id: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
