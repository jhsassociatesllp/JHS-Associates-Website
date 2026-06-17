from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.admin import Token, AdminLogin, AdminResponse, AdminInDB, AdminRole
from app.auth.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.auth.deps import (
    find_admin_by_email,
    get_current_admin,
    normalize_admin_data,
    require_admin_or_above,
    require_super_admin,
)
from app.database.connection import get_database
from datetime import timedelta, datetime, timezone

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login", response_model=Token)
async def login_for_access_token(admin: AdminLogin):
    db = get_database()
    admin_data = await find_admin_by_email(admin.email)
    
    if not admin_data or admin_data["password"] != admin.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    await db["admins"].update_one(
        {"_id": admin_data["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )

    admin_data = normalize_admin_data(admin_data, admin.email)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email, "role": admin_data["role"]}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-form", response_model=Token)
async def login_for_access_token_form(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    admin_data = await find_admin_by_email(form_data.username)
    
    if not admin_data or admin_data["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    await db["admins"].update_one(
        {"_id": admin_data["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )

    admin_data = normalize_admin_data(admin_data, form_data.username)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username, "role": admin_data["role"]}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminResponse)
async def read_users_me(current_admin: AdminInDB = Depends(get_current_admin)):
    return AdminResponse(
        id=current_admin.id, 
        email=current_admin.email,
        role=current_admin.role,
        name=current_admin.name,
        last_login=current_admin.last_login
    )

# Super Admin and HR Admin can access contacts
@router.get("/contacts")
async def get_admin_contacts(current_admin: AdminInDB = Depends(require_admin_or_above)):
    # Only Super Admin and HR Admin can access contacts
    if current_admin.role not in [AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin or HR Admin role required."
        )
    
    db = get_database()
    contacts = []
    cursor = db["contact_us"].find({}).sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        contacts.append(document)
    return contacts

# Super Admin and HR Admin can access alumni
@router.get("/alumni")
async def get_admin_alumni(current_admin: AdminInDB = Depends(require_admin_or_above)):
    # Only Super Admin and HR Admin can access alumni
    if current_admin.role not in [AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin or HR Admin role required."
        )
    
    db = get_database()
    alumni = []
    cursor = db["alumni"].find({}).sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        alumni.append(document)
    return alumni

# Only Super Admin can manage other admins
@router.get("/users")
async def get_all_admins(current_admin: AdminInDB = Depends(require_super_admin)):
    db = get_database()
    admins = []
    cursor = db["admins"].find({}, {"password": 0})  # Exclude password from response
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        admins.append(document)
    return admins
