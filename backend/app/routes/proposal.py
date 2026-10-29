from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from app.utils.validation import guard_form
from app.auth.deps import get_current_user, require_roles
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.proposal import ProposalCreate, ProposalResponse, ProposalStatusUpdate
from app.controllers import proposal as proposal_ctrl
from app.controllers.career_export import ExportError
from app.controllers.proposal import create_proposal, get_all_proposals
from typing import List, Optional

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


@router.get("/export")
async def export_proposals(
    date_from: Optional[str] = Query(None, max_length=10),
    date_to: Optional[str] = Query(None, max_length=10),
    status_filter: Optional[str] = Query(None, alias="status", max_length=20),
    current_admin: AdminInDB = Depends(hr_access),
):
    """Excel sheet of the proposal requests for the chosen days (Super Admin / HR Admin only)."""
    try:
        body, count, label = await proposal_ctrl.export_proposals(date_from, date_to, status_filter)
    except ExportError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    return Response(content=body, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={
        "Content-Disposition": f'attachment; filename="JHS_Proposal_Requests_{label}.xlsx"', "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff", "X-Application-Count": str(count),
    })


@router.patch("/{proposal_id}/status", response_model=ProposalResponse)
async def update_proposal_status(proposal_id: str, data: ProposalStatusUpdate, current_admin: AdminInDB = Depends(hr_access)):
    """Sets where a request stands (new / in review / proposal sent / closed) and an internal note."""
    try:
        updated = await proposal_ctrl.update_proposal_status(proposal_id, data, current_admin.email)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid proposal id")
    if not updated:
        raise HTTPException(status_code=404, detail="Proposal request not found")
    return updated
