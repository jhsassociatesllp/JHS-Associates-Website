from fastapi import APIRouter, Depends, HTTPException

from app.auth.deps import require_roles
from app.controllers import user as user_ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Site Users"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])


@router.get("/admin", response_model=list[UserResponse])
async def admin_list_users(current_admin: AdminInDB = Depends(hr_access)):
    return await user_ctrl.list_all_users()


@router.get("/admin/{user_id}", response_model=UserResponse)
async def admin_get_user(user_id: str, current_admin: AdminInDB = Depends(hr_access)):
    user = await user_ctrl.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/admin/{user_id}/activity")
async def admin_get_user_activity(user_id: str, current_admin: AdminInDB = Depends(hr_access)):
    user = await user_ctrl.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await user_ctrl.get_user_activity_summary(user_id)
