from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BlogCreate(BaseModel):
    title: str
    description: str
    content: str
    image_url: Optional[str] = None  # Firebase image URL (optional)


class BlogResponse(BaseModel):
    id: str
    title: str
    description: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True