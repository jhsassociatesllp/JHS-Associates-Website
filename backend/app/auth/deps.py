# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt, JWTError
# from app.auth.security import SECRET_KEY, ALGORITHM
# from app.schemas.admin import TokenData, AdminInDB, AdminRole
# from app.database.connection import get_database
# from typing import List

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login-form")

# async def get_current_admin(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         role: str = payload.get("role")
#         if email is None:
#             raise credentials_exception
#         token_data = TokenData(email=email, role=role)
#     except JWTError:
#         raise credentials_exception
    
#     db = get_database()
#     admin_data = await db["admins"].find_one({"email": token_data.email})
#     if admin_data is None:
#         raise credentials_exception
    
#     admin_data["id"] = str(admin_data["_id"])
#     del admin_data["_id"]
#     return AdminInDB(**admin_data)

# def require_roles(allowed_roles: List[AdminRole]):
#     def role_checker(current_admin: AdminInDB = Depends(get_current_admin)):
#         if current_admin.role not in allowed_roles:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Insufficient permissions"
#             )
#         return current_admin
#     return role_checker

# # Convenience functions for specific roles
# def require_super_admin(current_admin: AdminInDB = Depends(get_current_admin)):
#     if current_admin.role != AdminRole.SUPER_ADMIN:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Super admin access required"
#         )
#     return current_admin

# def require_admin_or_above(current_admin: AdminInDB = Depends(get_current_admin)):
#     allowed_roles = [AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN]
#     if current_admin.role not in allowed_roles:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Admin access required"
#         )
#     return current_admin


from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError

from app.auth.security import SECRET_KEY, ALGORITHM
from app.schemas.admin import TokenData, AdminInDB, AdminRole
from app.database.connection import get_database
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login-form")


async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email: str = payload.get("sub")
        role: str = payload.get("role")

        if email is None:
            raise credentials_exception

        token_data = TokenData(email=email, role=role)

    except InvalidTokenError:
        raise credentials_exception

    db = get_database()

    admin_data = await db["admins"].find_one(
        {"email": token_data.email}
    )

    if admin_data is None:
        raise credentials_exception

    admin_data["id"] = str(admin_data["_id"])
    del admin_data["_id"]

    return AdminInDB(**admin_data)


def require_roles(allowed_roles: List[AdminRole]):
    def role_checker(
        current_admin: AdminInDB = Depends(get_current_admin)
    ):
        if current_admin.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )

        return current_admin

    return role_checker


def require_super_admin(
    current_admin: AdminInDB = Depends(get_current_admin)
):
    if current_admin.role != AdminRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )

    return current_admin


def require_admin_or_above(
    current_admin: AdminInDB = Depends(get_current_admin)
):
    allowed_roles = [
        AdminRole.ADMIN,
        AdminRole.SUPER_ADMIN,
        AdminRole.HR_ADMIN
    ]

    if current_admin.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_admin