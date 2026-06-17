from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


JobStatus = Literal["draft", "open", "closed"]
ApplicationStatus = Literal["new", "reviewing", "shortlisted", "rejected", "hired"]


class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    department: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=120)
    employment_type: str = Field(..., min_length=2, max_length=80)
    experience: str = Field(..., min_length=1, max_length=80)
    summary: str = Field(..., min_length=2, max_length=600)
    description: str = Field(..., min_length=2, max_length=4000)
    requirements: str = Field(..., min_length=2, max_length=4000)
    status: JobStatus = "open"


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=160)
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    location: Optional[str] = Field(None, min_length=2, max_length=120)
    employment_type: Optional[str] = Field(None, min_length=2, max_length=80)
    experience: Optional[str] = Field(None, min_length=1, max_length=80)
    summary: Optional[str] = Field(None, min_length=2, max_length=600)
    description: Optional[str] = Field(None, min_length=2, max_length=4000)
    requirements: Optional[str] = Field(None, min_length=2, max_length=4000)
    status: Optional[JobStatus] = None


class JobResponse(JobBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None


class ApplicationCreate(BaseModel):
    job_id: str
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=30)
    current_location: Optional[str] = Field(None, max_length=120)
    experience_years: Optional[str] = Field(None, max_length=40)
    cover_letter: Optional[str] = Field(None, max_length=2000)


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(ApplicationCreate):
    id: str
    job_title: str
    resume_file_id: Optional[str] = None
    resume_filename: Optional[str] = None
    resume_content_type: Optional[str] = None
    resume_size: Optional[int] = None
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
