from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel

Platform = Literal["YouTube", "Spotify", "Apple Podcasts", "Website", "Other"]
PodcastStatus = Literal["draft", "published"]

PLATFORMS = ["YouTube", "Spotify", "Apple Podcasts", "Website", "Other"]


class PodcastPublic(BaseModel):
    id: str
    title: str
    description: str
    guest: Optional[str] = None       # guest / speaker name(s)
    duration: Optional[str] = None    # free text, e.g. "32 min"
    platform: Platform
    listen_url: str
    published_on: str                 # YYYY-MM-DD
    image_id: Optional[str] = None
    created_at: datetime


class PodcastAdmin(PodcastPublic):
    status: PodcastStatus
    updated_at: Optional[datetime] = None
    last_edited_by: Optional[str] = None
