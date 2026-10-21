from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from app.utils.validation import Email, Name, Phone, ShortText, _text, optional_blank_to_none


JobStatus = Literal["draft", "open", "closed"]
ApplicationStatus = Literal["new", "reviewing", "shortlisted", "rejected", "hired"]


def _clean_keyword_list(value: list[str]) -> list[str]:
    cleaned: list[str] = []
    for kw in value:
        kw = " ".join(str(kw).split())[:60]
        if kw and kw.lower() not in [c.lower() for c in cleaned]:
            cleaned.append(kw)
    return cleaned


class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    department: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=120)
    employment_type: str = Field(..., min_length=2, max_length=80)
    experience: str = Field(..., min_length=1, max_length=80)
    description: str = Field(..., min_length=2, max_length=4000)
    status: JobStatus = "open"
    # Skills / terms the recruiter wants the ATS to look for (optional; the
    # description is analysed automatically as well).
    keywords: list[str] = Field(default_factory=list, max_length=40)

    @field_validator("keywords")
    @classmethod
    def _clean_keywords(cls, value: list[str]) -> list[str]:
        return _clean_keyword_list(value)


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=160)
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    location: Optional[str] = Field(None, min_length=2, max_length=120)
    employment_type: Optional[str] = Field(None, min_length=2, max_length=80)
    experience: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = Field(None, min_length=2, max_length=4000)
    status: Optional[JobStatus] = None
    keywords: Optional[list[str]] = Field(None, max_length=40)

    @field_validator("keywords")
    @classmethod
    def _clean_keywords(cls, value):
        return _clean_keyword_list(value) if value is not None else value


class JobResponse(JobBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None


Qualification = Literal["Graduate", "Post Graduate", "Pursuing CA", "Pursuing CS", "Others"]
ApplicantProfile = Literal[
    "CA Articles", "CS Intern", "Fresher", "Semi Qualified CA", "CS Inter", "Qualified CA", "Qualified CS", "Other",
]
HowHeard = Literal["LinkedIn", "Indeed", "Naukri", "Employee", "Google", "Social Media", "Advertise", "Other"]


class ApplicationCreate(BaseModel):
    """Strict rules for new applications (FRM-02/06). Stored records are read back with ApplicationResponse."""
    job_id: Optional[str] = Field(None, max_length=40)
    full_name: Name
    email: Email
    phone: Phone
    current_location: Optional[ShortText] = None
    experience_years: Optional[_text(1, 40)] = None
    cover_letter: Optional[_text(1, 2000)] = None
    place_of_residence: Optional[ShortText] = None
    highest_qualification: Qualification
    highest_qualification_other: Optional[_text(1, 120)] = None
    profile: ApplicantProfile
    profile_other: Optional[_text(1, 120)] = None
    current_ctc: Optional[_text(1, 40)] = None
    expected_ctc: Optional[_text(1, 40)] = None
    how_heard: HowHeard
    how_heard_detail: Optional[_text(1, 200)] = None
    consent: bool = False

    @field_validator(
        "job_id", "current_location", "experience_years", "cover_letter", "place_of_residence",
        "highest_qualification_other", "profile_other", "current_ctc", "expected_ctc", "how_heard_detail",
        mode="before",
    )
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)

    @field_validator("consent")
    @classmethod
    def _consent(cls, v: bool) -> bool:
        if v is not True:
            raise ValueError("Please accept the Privacy Policy to continue")
        return v

    @model_validator(mode="after")
    def _others(self):
        if self.highest_qualification == "Others" and not self.highest_qualification_other:
            raise ValueError("Please specify your qualification")
        if self.profile == "Other" and not self.profile_other:
            raise ValueError("Please specify your profile")
        return self


class ApplicationFields(BaseModel):
    job_id: Optional[str] = None
    full_name: str
    email: str
    phone: str
    current_location: Optional[str] = None
    experience_years: Optional[str] = None
    cover_letter: Optional[str] = None
    place_of_residence: Optional[str] = None
    highest_qualification: Optional[str] = None
    highest_qualification_other: Optional[str] = None
    profile: Optional[str] = None
    profile_other: Optional[str] = None
    current_ctc: Optional[str] = None
    expected_ctc: Optional[str] = None
    how_heard: Optional[str] = None
    how_heard_detail: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(ApplicationFields):
    id: str
    job_title: Optional[str] = None
    resume_file_id: Optional[str] = None
    resume_filename: Optional[str] = None
    resume_content_type: Optional[str] = None
    resume_size: Optional[int] = None
    # ATS resume-match result (see app/services/ats.py)
    ats_score: Optional[int] = None
    ats_status: Optional[str] = None   # matched | below | unreadable | not_applicable
    ats_match: Optional[bool] = None
    ats_details: Optional[dict[str, Any]] = None
    ats_scored_at: Optional[datetime] = None
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
