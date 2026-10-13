from fastapi import APIRouter, HTTPException, Request, status, Depends
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.controllers.feedback import create_feedback, get_all_feedbacks, get_feedback_by_id, delete_feedback
from app.auth.deps import require_roles
from app.schemas.admin import AdminRole
from typing import List
from app.utils.netutil import client_ip, throttle

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])

router = APIRouter(prefix="/feedback", tags=["Feedback"])

# Public endpoint - anyone can submit feedback
@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(request: Request, feedback: FeedbackCreate):
    throttle(f"feedback:{client_ip(request)}", 3600, 10)
    try:
        result = await create_feedback(feedback)
        return result
    except Exception as e:
        print(f"Error submitting feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit feedback"
        )

# Protected endpoint - only admin can view all feedbacks
@router.get("/", response_model=List[FeedbackResponse])
async def list_feedbacks(current_admin = Depends(hr_access)):
    try:
        feedbacks = await get_all_feedbacks()
        return feedbacks
    except Exception as e:
        print(f"Error retrieving feedbacks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve feedbacks"
        )

# Protected endpoint - get single feedback
@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(feedback_id: str, current_admin = Depends(hr_access)):
    try:
        feedback = await get_feedback_by_id(feedback_id)
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        return feedback
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve feedback"
        )

# Protected endpoint - delete feedback
@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_feedback(feedback_id: str, current_admin = Depends(hr_access)):
    try:
        success = await delete_feedback(feedback_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete feedback"
        )
