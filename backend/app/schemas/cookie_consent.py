from typing import Literal, Optional

from pydantic import BaseModel, Field

# Bump when the cookie categories / policy change: visitors are asked again.
POLICY_VERSION = "1.0"
# How long a recorded choice (and the browser cookie) is kept.
RETENTION_DAYS = 365

ConsentStatus = Literal["accepted", "rejected", "custom"]

UUID_PATTERN = r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"


class ConsentSubmit(BaseModel):
    visitor_id: str = Field(..., pattern=UUID_PATTERN)
    status: ConsentStatus
    preferences: bool = False
    # Path only (no query string / personal data); trimmed server-side too.
    page: Optional[str] = Field(None, max_length=200)
    policy_version: str = Field(POLICY_VERSION, max_length=10)
