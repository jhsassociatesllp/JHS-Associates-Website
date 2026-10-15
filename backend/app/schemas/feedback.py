from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Annotated, Literal, Optional, List
from datetime import datetime

from app.utils.validation import FormGuard, Name, _no_markup, _text, optional_blank_to_none

# a short optional free-text box: trimmed, no angle brackets, at most 100 characters
_Opt100 = Annotated[str, Field(max_length=100)]


class ReferenceItem(BaseModel):
    company_name: str = Field("", max_length=100)
    name_designation: str = Field("", max_length=100)
    phone: str = Field("", max_length=30)
    email: str = Field("", max_length=254)

    @field_validator("company_name", "name_designation", "phone", "email")
    @classmethod
    def _plain(cls, v: str) -> str:
        return _no_markup(v.strip())


class FeedbackCreate(FormGuard):
    # Basic Information
    client_name: _text(2, 200)
    nature_of_assignment: _text(2, 300)
    period_of_assignment: Optional[_text(1, 100)] = None
    assignment_reporting: _text(1, 100) = "CEO"
    assignment_spoc: Optional[_text(1, 100)] = None
    
    # On-boarding ratings (1-5)
    onboarding_reason: int = Field(0, ge=0, le=5)
    competitive_fees: int = Field(0, ge=0, le=5)
    technically_better: int = Field(0, ge=0, le=5)
    referred_by_someone: int = Field(0, ge=0, le=5)
    
    # Fees Range ratings
    value_for_money: int = Field(0, ge=0, le=5)
    reasonable: int = Field(0, ge=0, le=5)
    
    # Quality ratings
    delivery: int = Field(0, ge=0, le=5)
    status_review: int = Field(0, ge=0, le=5)
    draft_discussions: int = Field(0, ge=0, le=5)
    reporting: int = Field(0, ge=0, le=5)
    timelines: int = Field(0, ge=0, le=5)
    
    # Communication ratings
    project_team: int = Field(0, ge=0, le=5)
    response_time: int = Field(0, ge=0, le=5)
    
    # Overall ratings
    overall: int = Field(0, ge=0, le=5)
    meet_service_objectives: int = Field(0, ge=0, le=5)
    knowledge: int = Field(0, ge=0, le=5)
    research_publications: int = Field(0, ge=0, le=5)
    
    # Yes/No questions
    would_refer: Literal["", "Yes", "No", "Maybe"] = ""
    delighted_by_service: Literal["", "Yes", "No", "Maybe"] = ""
    
    # References
    references: List[ReferenceItem] = Field(default_factory=list, max_length=5)
    
    # Testimonial
    testimonial: Optional[_text(1, 2000)] = None
    
    # Your Details
    name: Name
    designation: _text(2, 100)

    @field_validator("period_of_assignment", "assignment_spoc", "testimonial", mode="before")
    @classmethod
    def _blank(cls, v):
        return optional_blank_to_none(v)


class FeedbackResponse(BaseModel):
    id: str
    client_name: str
    nature_of_assignment: str
    period_of_assignment: Optional[str]
    assignment_reporting: str
    assignment_spoc: Optional[str]
    
    onboarding_reason: int
    competitive_fees: int
    technically_better: int
    referred_by_someone: int
    
    value_for_money: int
    reasonable: int
    
    delivery: int
    status_review: int
    draft_discussions: int
    reporting: int
    timelines: int
    
    project_team: int
    response_time: int
    
    overall: int
    meet_service_objectives: int
    knowledge: int
    research_publications: int
    
    would_refer: str
    delighted_by_service: str
    
    references: List[ReferenceItem]
    testimonial: Optional[str]
    
    name: str
    designation: str
    created_at: datetime

    class Config:
        populate_by_name = True
