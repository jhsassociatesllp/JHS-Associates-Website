from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class EditHistory(BaseModel):
    edited_by: str
    edited_at: datetime
    fields_changed: List[str]


class WhitePaperCreate(BaseModel):
    title: str
    short_description: str
    pdf_id: str  # GridFS file ID for PDF


class WhitePaperUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    pdf_id: Optional[str] = None
    edited_by: str


class WhitePaperResponse(BaseModel):
    id: str
    title: str
    short_description: str
    pdf_id: str
    created_at: datetime
    last_edited_by: Optional[str] = None
    last_edited_at: Optional[datetime] = None
    edit_history: List[EditHistory] = []

    class Config:
        from_attributes = True
