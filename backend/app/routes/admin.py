import hmac

import jwt

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.admin import Token, AdminLogin, AdminResponse, AdminInDB, AdminRole
from app.auth.security import ALGORITHM, SECRET_KEY, verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.auth.throttle import MAX_FAILS, MAX_FAILS_PER_IP, check_login_allowed, clear_failures, record_failure
from app.utils.netutil import client_ip
from app.auth.deps import (
    oauth2_scheme,
    find_admin_by_email,
    get_current_admin,
    normalize_admin_data,
    require_admin_or_above,
    require_super_admin,
)
from app.database.connection import get_database
from datetime import timedelta, datetime, timezone

router = APIRouter(prefix="/admin", tags=["Admin"])

def _password_ok(admin_data: dict, supplied: str) -> bool:
    """bcrypt hash, or (older accounts) a plain-text password that is upgraded to a hash on first login."""
    stored = admin_data.get("password") or ""
    if stored.startswith("$2"):
        try:
            return verify_password(supplied, stored)
        except Exception:
            return False
    return hmac.compare_digest(stored.encode(), (supplied or "").encode())


async def _authenticate(request: Request, email: str, password: str) -> str:
    """Shared by both login routes. Returns an admin access token or raises 401 / 429."""
    email = (email or "").strip()
    ip = client_ip(request)
    keys = [(f"admin:{email.lower()}", MAX_FAILS), (f"ip:{ip}", MAX_FAILS_PER_IP)]
    await check_login_allowed(keys)

    db = get_database()
    admin_data = await find_admin_by_email(email)
    # Same message and similar work whether the account exists or not.
    if not admin_data or not _password_ok(admin_data, password):
        await record_failure([k for k, _ in keys])
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    updates = {"last_login": datetime.now(timezone.utc).isoformat()}
    if not (admin_data.get("password") or "").startswith("$2"):
        updates["password"] = get_password_hash(password)       # upgrade plain text -> bcrypt
    await db["admins"].update_one({"_id": admin_data["_id"]}, {"$set": updates})
    await clear_failures(f"admin:{email.lower()}")

    admin_data = normalize_admin_data(admin_data, email)
    return create_access_token(
        data={"sub": email, "role": admin_data["role"], "type": "admin"},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )


@router.post("/login", response_model=Token)
async def login_for_access_token(request: Request, admin: AdminLogin):
    return {"access_token": await _authenticate(request, admin.email, admin.password), "token_type": "bearer"}


@router.post("/login-form", response_model=Token)
async def login_for_access_token_form(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    return {"access_token": await _authenticate(request, form_data.username, form_data.password), "token_type": "bearer"}

@router.get("/audit-log")
async def admin_audit_log(limit: int = 200, current_admin: AdminInDB = Depends(require_super_admin)):
    """Newest first: who changed what, and every admin sign-in attempt (Super Admin only)."""
    limit = max(1, min(limit, 1000))
    out = []
    async for d in get_database()["admin_audit_log"].find({}).sort("at", -1).limit(limit):
        d["id"] = str(d.pop("_id"))
        out.append(d)
    return out


@router.post("/logout", status_code=204)
async def admin_logout(token: str = Depends(oauth2_scheme)):
    """Ends this admin session for good: the token's id is remembered until the token would have expired anyway."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError:
        return None
    jti, exp = payload.get("jti"), payload.get("exp")
    if payload.get("type") == "admin" and jti and exp:
        col = get_database()["revoked_tokens"]
        await col.create_index("expires_at", expireAfterSeconds=0)
        await col.update_one({"jti": jti}, {"$set": {"jti": jti, "expires_at": datetime.fromtimestamp(exp, tz=timezone.utc)}}, upsert=True)
    return None


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
