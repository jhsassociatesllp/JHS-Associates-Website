from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class EditHistory(BaseModel):
    edited_by: str
    edited_at: datetime
    fields_changed: List[str]


class ArticleCreate(BaseModel):
    title: str
    short_description: str
    content: str
    author: str
    image_id: str  # GridFS file ID for image
    pdf_id: str  # GridFS file ID for PDF
    publish_date: datetime


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    image_id: Optional[str] = None
    pdf_id: Optional[str] = None
    publish_date: Optional[datetime] = None
    edited_by: str


class ArticleResponse(BaseModel):
    id: str
    title: str
    short_description: str
    content: str
    author: str
    image_id: str
    pdf_id: str
    publish_date: datetime
    created_at: datetime
    last_edited_by: Optional[str] = None
    last_edited_at: Optional[datetime] = None
    edit_history: List[EditHistory] = []

    class Config:
        from_attributes = True
