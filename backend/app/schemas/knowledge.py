from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class EditHistory(BaseModel):
    edited_by: str
    edited_at: datetime
    fields_changed: List[str]


class KnowledgeCreate(BaseModel):
    title: str
    short_description: str
    content: str
    image_id: str  # GridFS file ID for image
    pdf_id: str  # GridFS file ID for PDF


class KnowledgeUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[str] = None
    image_id: Optional[str] = None
    pdf_id: Optional[str] = None
    edited_by: str


class KnowledgeResponse(BaseModel):
    id: str
    title: str
    short_description: str
    content: str
    image_id: str
    pdf_id: str
    created_at: datetime
    last_edited_by: Optional[str] = None
    last_edited_at: Optional[datetime] = None
    edit_history: List[EditHistory] = []

    class Config:
        from_attributes = True