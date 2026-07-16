from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class EditHistory(BaseModel):
    edited_by: str
    edited_at: datetime
    fields_changed: List[str]


class ExcellenciaCreate(BaseModel):
    heading: str
    short_description: str
    image_id: Optional[str] = None  # GridFS file ID for image
    button_text: Optional[str] = None
    button_url: Optional[str] = None


class ExcellenciaUpdate(BaseModel):
    heading: Optional[str] = None
    short_description: Optional[str] = None
    image_id: Optional[str] = None
    button_text: Optional[str] = None
    button_url: Optional[str] = None
    edited_by: str


class ExcellenciaResponse(BaseModel):
    id: str
    heading: str
    short_description: str
    image_id: Optional[str] = None
    button_text: Optional[str] = None
    button_url: Optional[str] = None
    created_at: datetime
    last_edited_by: Optional[str] = None
    last_edited_at: Optional[datetime] = None
    edit_history: List[EditHistory] = []

    class Config:
        from_attributes = True
