from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.admin import Token, AdminLogin, AdminResponse, AdminInDB
from app.auth.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.auth.deps import get_current_admin
from app.database.connection import get_database
from datetime import timedelta

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login", response_model=Token)
async def login_for_access_token(admin: AdminLogin):
    db = get_database()
    admin_data = await db["admins"].find_one({"emails": admin.email})
    
    if not admin_data or admin_data["password"] != admin.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-form", response_model=Token)
async def login_for_access_token_form(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    admin_data = await db["admins"].find_one({"emails": form_data.username})
    
    if not admin_data or admin_data["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminResponse)
async def read_users_me(current_admin: AdminInDB = Depends(get_current_admin)):
    return AdminResponse(id=current_admin.id, email=current_admin.email)

@router.get("/contacts")
async def get_admin_contacts(current_admin: AdminInDB = Depends(get_current_admin)):
    db = get_database()
    contacts = []
    cursor = db["contact_us"].find({}).sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        contacts.append(document)
    return contacts

@router.get("/alumni")
async def get_admin_alumni(current_admin: AdminInDB = Depends(get_current_admin)):
    db = get_database()
    alumni = []
    cursor = db["alumni_network"].find({}).sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        alumni.append(document)
    return alumni
