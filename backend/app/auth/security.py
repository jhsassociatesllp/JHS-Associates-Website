# from datetime import datetime, timedelta, timezone
# from typing import Optional
# from jose import jwt
# from passlib.context import CryptContext

# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt


from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from passlib.context import CryptContext

import logging
import secrets

from app.config.settings import settings

SECRET_KEY = settings.secret_key
if not SECRET_KEY:
    # Never fall back to a known value. Without SECRET_KEY in the environment every
    # restart gets a fresh random key (logins/sessions reset) until it is configured.
    SECRET_KEY = secrets.token_urlsafe(64)
    logging.getLogger(__name__).warning("SECRET_KEY is not set - using a temporary random key. Set SECRET_KEY in the environment.")
ALGORITHM = "HS256"
# Admin panel session length. Used only by the two /admin/login* routes —
# every other token type (site users, careers, consulting) sets its own
# expires_delta and ignores this constant.
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 2

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt