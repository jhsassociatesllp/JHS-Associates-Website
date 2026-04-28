from fastapi import APIRouter, HTTPException, status
from app.schemas.contact import ContactCreate, ContactResponse
from app.controllers.contact import create_contact_message, get_all_contacts
from typing import List

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(contact: ContactCreate):
    try:
        result = await create_contact_message(contact)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact message"
        )

@router.get("/", response_model=List[ContactResponse])
async def list_contacts():
    try:
        contacts = await get_all_contacts()
        return contacts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve contact messages"
        )
