from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.deps import get_current_user
from app.schemas.proposal import ProposalCreate, ProposalResponse
from app.controllers.proposal import create_proposal, get_all_proposals
from typing import List

router = APIRouter(prefix="/proposal", tags=["Proposal"])

@router.post("/", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
async def submit_proposal(proposal: ProposalCreate, user: dict = Depends(get_current_user)):
    try:
        result = await create_proposal(proposal, user)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit proposal request"
        )

@router.get("/", response_model=List[ProposalResponse])
async def list_proposals():
    try:
        proposals = await get_all_proposals()
        return proposals
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve proposal requests"
        )
