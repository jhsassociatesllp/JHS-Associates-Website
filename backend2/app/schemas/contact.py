from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=1000)

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
