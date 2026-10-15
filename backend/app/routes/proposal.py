from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.utils.validation import guard_form
from app.auth.deps import get_current_user, require_roles
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.proposal import ProposalCreate, ProposalResponse
from app.controllers.proposal import create_proposal, get_all_proposals
from typing import List

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])

router = APIRouter(prefix="/proposal", tags=["Proposal"])

@router.post("/", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
async def submit_proposal(request: Request, proposal: ProposalCreate, user: dict = Depends(get_current_user)):
    await guard_form(request, proposal, "proposal", per_hour=15, per_minute=3, dup=proposal.email + proposal.subject + proposal.message)
    try:
        result = await create_proposal(proposal, user)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit proposal request"
        )

@router.get("/", response_model=List[ProposalResponse])
async def list_proposals(current_admin: AdminInDB = Depends(hr_access)):
    try:
        proposals = await get_all_proposals()
        return proposals
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve proposal requests"
        )
