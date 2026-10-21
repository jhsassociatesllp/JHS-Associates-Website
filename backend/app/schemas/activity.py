from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr

DownloadResourceType = Literal["whitepaper", "newsletter", "regulatory", "knowledge", "article"]


class ActivityResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_email: EmailStr
    type: Literal["download"]
    resource_type: DownloadResourceType
    resource_id: str
    resource_title: str
    created_at: datetime
