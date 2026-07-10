from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ProposalCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    inquiry_reason: str = Field(..., min_length=2, max_length=200)
    subject: str = Field(..., min_length=2, max_length=300)
    message: Optional[str] = Field(None, max_length=2000)

class ProposalResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    inquiry_reason: str
    subject: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True
