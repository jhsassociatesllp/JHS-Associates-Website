from typing import List, Optional

from pydantic import BaseModel, Field


class SubService(BaseModel):
    # Stable id inside its service ("01", "02", ...). Left empty for a brand-new
    # sub-service; the API assigns the next free id.
    id: str = ""
    title: str = Field(..., min_length=1, max_length=300)
    desc: str = Field("", max_length=500)
    order: int = 0


class ServiceIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    points: List[SubService] = []
    order: Optional[int] = None


class ServiceOut(BaseModel):
    key: str
    name: str
    order: int = 0
    points: List[SubService] = []


class SectorIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    order: Optional[int] = None


class SectorOut(BaseModel):
    id: str
    name: str
    order: int = 0
