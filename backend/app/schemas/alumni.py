from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class AlumniCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    company: str = Field(..., min_length=2, max_length=100)
    designation: str = Field(..., min_length=2, max_length=100)
    tenure: str = Field(..., min_length=2, max_length=50)
    last_role: str = Field(..., min_length=2, max_length=100)
    message: Optional[str] = None

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
