from fastapi import APIRouter, Depends

from app.auth.deps import require_roles
from app.controllers import activity as activity_ctrl
from app.schemas.activity import ActivityResponse
from app.schemas.admin import AdminInDB, AdminRole

router = APIRouter(prefix="/activity", tags=["User Activity"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])


@router.get("/admin", response_model=list[ActivityResponse])
async def admin_list_activity(current_admin: AdminInDB = Depends(hr_access)):
    return await activity_ctrl.list_all_activity()
