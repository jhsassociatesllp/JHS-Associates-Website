from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

# One collection holds everyone on the Leadership page; a person's standing is
# expressed purely through the `roles` tags below (a Governance Council member
# who is also a Partner carries both tags).
ROLES = ["Partner", "Governance Council", "Advisory Board Member", "Associate"]

SERVICES = [
    "Assurance",
    "Consulting",
    "Taxation",
    "IT Assurance",
    "Outsourcing",
    "Corporate Finance",
    "Learning & Development",
    "Compliance & Governance",
    "Single Window Assistance",
    "SOC Attestation",
]

SECTORS = [
    "Media",
    "IT System Audit",
    "IT / ITeS",
    "FMCG",
    "Retail",
    "Oil & Gas",
    "Housing",
    "Real Estate",
    "Commodity",
    "Gems & Jewellery",
    "Banking",
    "Retail & Corporate Banking",
    "Insurance",
    "Broking",
    "Mutual Funds",
    "Digital Currency",
    "Crypto & Blockchain Advisory",
    "Family Oriented Businesses",
    "Portfolio Management",
    "Venture Capital",
    "NBFC",
    "Healthcare",
    "Constructions",
    "Manufacturing",
    "Logistics",
    "NGO",
]

# City pages a person is shown on (each city page lists everyone tagged with it).
CITIES = ["Mumbai", "Gujarat", "Bengaluru", "Chennai", "Delhi", "Kolkata", "Hyderabad", "Global"]

STATUSES = ["Active", "Inactive"]


class LeadershipResponse(BaseModel):
    id: str
    name: str
    education: str = ""
    description: str = ""
    location: str = ""
    email: Optional[str] = None
    linkedin: Optional[str] = None
    services: List[str] = []
    sectors: List[str] = []
    cities: List[str] = []
    # Sub-services this person is listed under, as "<service-key>:<point-id>".
    service_points: List[str] = []
    # Free-text expertise tags shown on the profile card ("Risk & Governance").
    specializations: List[str] = []
    roles: List[str] = []
    # Heading of the Leadership-page group this person is listed under.
    section: Optional[str] = None
    status: str = "Active"
    display_order: int = 0
    # Either an uploaded photo (GridFS id) or a bundled static file name.
    photo_id: Optional[str] = None
    photo_file: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
