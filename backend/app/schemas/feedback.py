from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class ReferenceItem(BaseModel):
    company_name: str = ""
    name_designation: str = ""
    phone: str = ""
    email: str = ""

class FeedbackCreate(BaseModel):
    # Basic Information
    client_name: str = Field(..., min_length=2, max_length=200)
    nature_of_assignment: str = Field(..., min_length=2, max_length=300)
    period_of_assignment: Optional[str] = None
    assignment_reporting: str = "CEO"
    assignment_spoc: Optional[str] = None
    
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
    would_refer: str = ""
    delighted_by_service: str = ""
    
    # References
    references: List[ReferenceItem] = []
    
    # Testimonial
    testimonial: Optional[str] = None
    
    # Your Details
    name: str = Field(..., min_length=2, max_length=100)
    designation: str = Field(..., min_length=2, max_length=100)

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
