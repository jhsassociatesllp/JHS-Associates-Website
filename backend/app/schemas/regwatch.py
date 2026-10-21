from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

Regulator = Literal["SEBI", "RBI", "MCA", "GST", "Income Tax", "FEMA", "IRDAI", "Other"]
RegWatchStatus = Literal["draft", "published"]

REGULATORS = ["SEBI", "RBI", "MCA", "GST", "Income Tax", "FEMA", "IRDAI", "Other"]


class RegWatchPublic(BaseModel):
    id: str
    title: str
    summary: str
    regulator: Regulator
    reference: Optional[str] = None
    published_on: str                 # date of the circular / notification, YYYY-MM-DD
    pdf_id: str
    image_id: Optional[str] = None
    created_at: datetime


class RegWatchAdmin(RegWatchPublic):
    status: RegWatchStatus
    updated_at: Optional[datetime] = None
    last_edited_by: Optional[str] = None
