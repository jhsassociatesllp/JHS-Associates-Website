from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class ArticleCreate(BaseModel):
    heading: str
    short_description: str
    button_text: str
    pdf_url: str  # Firebase download URL


class ArticleResponse(BaseModel):
    id: str
    heading: str
    short_description: str
    button_text: str
    pdf_url: str
    created_at: datetime

    class Config:
        from_attributes = True