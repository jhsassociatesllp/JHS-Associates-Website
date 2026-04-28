from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.auth.security import SECRET_KEY, ALGORITHM
from app.schemas.admin import TokenData, AdminInDB
from app.database.connection import get_database

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
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    db = get_database()
    admin_data = await db["admins"].find_one({"emails": token_data.email})
    if admin_data is None:
        raise credentials_exception
    
    admin_data["id"] = str(admin_data["_id"])
    return AdminInDB(**admin_data)
