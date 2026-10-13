from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.auth.deps import require_roles
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.contact import ContactCreate, ContactResponse
from app.controllers.contact import create_contact_message, get_all_contacts
from typing import List
from app.utils.netutil import client_ip, throttle

router = APIRouter(prefix="/contact", tags=["Contact"])

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(request: Request, contact: ContactCreate):
    throttle(f"contact:{client_ip(request)}", 3600, 10)   # each submission sends emails, so keep it bounded
    try:
        result = await create_contact_message(contact)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact message"
        )

@router.get("/", response_model=List[ContactResponse])
async def list_contacts(current_admin: AdminInDB = Depends(hr_access)):
    try:
        contacts = await get_all_contacts()
        return contacts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve contact messages"
        )
