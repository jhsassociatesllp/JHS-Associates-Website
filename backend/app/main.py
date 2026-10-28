import asyncio
import logging
import sys

from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from contextlib import asynccontextmanager
from app.database.connection import connect_to_mongo, close_mongo_connection

# Without this, app loggers (e.g. email_service) have no handler and fall
# back to Python's WARNING-only "last resort" handler — so INFO-level
# success/failure logs (like "Email sent" / "Email send error") are
# invisible on a bare `uvicorn` run. errors="replace" on the stream also
# stops a stray non-ASCII character in a log message from raising
# UnicodeEncodeError and silently discarding the whole log record, which is
# exactly what happens on a Windows console using a legacy (non-UTF-8)
# codepage.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    stream=sys.stdout,
)
from app.routes import contact, alumni, admin, careers
from app.routes.articles import router as articles_router   # ✅ NEW
from app.routes.blogs import router as blogs_router         # ✅ NEW
from app.routes.knowledge import router as knowledge_router # ✅ NEW
from app.routes.whitepaper import router as whitepaper_router # ✅ NEW
from app.routes.feedback import router as feedback_router   # ✅ FEEDBACK
from app.routes.proposal import router as proposal_router   # ✅ PROPOSAL
from app.routes.excellencia import router as excellencia_router # ✅ NEW
from app.routes.newsletter import router as newsletter_router # ✅ NEW
from app.routes.regulatory import router as regulatory_router # ✅ NEW
from app.routes.appointments import router as appointments_router # ✅ NEW
from app.routes.otp import router as otp_router
from app.routes.regwatch import router as regwatch_router
from app.routes.podcasts import router as podcasts_router
from app.routes.notifications import router as notifications_router
from app.routes.consultation import router as consultation_router # ✅ NEW
from app.routes.auth import router as auth_router             # ✅ SITE ACCOUNT
from app.routes.user import router as user_admin_router       # ✅ SITE ACCOUNT
from app.routes.activity import router as activity_router     # ✅ SITE ACCOUNT
from app.routes.leadership import router as leadership_router # ✅ LEADERSHIP
from app.routes.catalog import router as catalog_router       # ✅ SERVICES & SECTORS
from app.routes.cookie_consent import router as cookie_consent_router # ✅ COOKIE CONSENT
from app.routes.events import router as events_router                 # ✅ EVENTS


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    from app.services.email_service import log_email_settings
    log_email_settings()   # says in the logs whether email is switched on
    await connect_to_mongo()
    from app.services.seed import seed_defaults
    # fills an empty database once (never overwrites); runs in the background so a slow database cannot delay start-up
    app.state.seed_task = asyncio.create_task(seed_defaults())
    worker = None
    if settings.notify_worker_enabled:
        from app.controllers.notify import worker_loop
        worker = asyncio.create_task(worker_loop())   # sends "new insight" emails in the background
    yield
    if worker:
        worker.cancel()
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="JHS Backend",
    description="FastAPI Backend for JHS Website",
    version="1.0.0",
    lifespan=lifespan,
    # Interactive API docs are a map of every endpoint: development only.
    docs_url="/api/docs" if settings.app_env == "development" else None,
    redoc_url=None,
    openapi_url="/api/openapi.json" if settings.app_env == "development" else None,
    redirect_slashes=True
)

# Configure CORS
_cors = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
if settings.app_env == "development":
    _cors += ["http://localhost:5173", "http://localhost:5180", "http://localhost:5181",
              "http://127.0.0.1:5173", "http://127.0.0.1:5180", "http://127.0.0.1:5181"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors,
    allow_credentials=False,   # logins use an Authorization header, not cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-OTP-Token"],
)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    path = request.url.path
    if "/image/" in path or "/photo/" in path:
        # Uploaded pictures can never run script even if one were opened directly.
        response.headers.setdefault("Content-Security-Policy", "default-src 'none'; sandbox")
    return response


MAX_JSON_BODY = 64 * 1024

AUDIT_COLLECTION = "admin_audit_log"
_audit_ready = False


async def _write_audit(entry: dict) -> None:
    """Best effort: a database hiccup must never break the request that was already answered."""
    global _audit_ready
    try:
        from app.database.connection import get_database
        col = get_database()[AUDIT_COLLECTION]
        if not _audit_ready:
            await col.create_index("at", expireAfterSeconds=400 * 24 * 3600)   # keep about 13 months
            _audit_ready = True
        await col.insert_one(entry)
    except Exception:
        logging.getLogger("api").warning("audit log write failed", exc_info=True)


@app.middleware("http")
async def admin_audit(request, call_next):
    """Records who changed what in the admin panel: every admin write (POST/PUT/PATCH/DELETE) and every admin sign-in attempt."""
    response = await call_next(request)
    try:
        path = request.url.path
        if request.method in ("POST", "PUT", "PATCH", "DELETE") and path.startswith("/api/"):
            actor = None
            auth = request.headers.get("authorization", "")
            if auth.lower().startswith("bearer "):
                import jwt as _jwt
                from app.auth.security import ALGORITHM, SECRET_KEY
                try:
                    payload = _jwt.decode(auth[7:], SECRET_KEY, algorithms=[ALGORITHM])
                    if payload.get("type") == "admin":
                        actor = payload.get("sub")
                except Exception:
                    actor = None
            is_login = path.startswith("/api/admin/login")
            if actor or is_login:
                from datetime import datetime, timezone
                from app.utils.netutil import client_ip
                asyncio.create_task(_write_audit({
                    "at": datetime.now(timezone.utc), "actor": actor, "method": request.method, "path": path[:200],
                    "status": response.status_code, "ip": client_ip(request), "kind": "login" if is_login else "change",
                }))
    except Exception:
        pass
    return response


@app.middleware("http")
async def limit_json_body(request, call_next):
    # Cheap early refusal of oversized JSON bodies (nginx also enforces this at the edge).
    if "application/json" in request.headers.get("content-type", ""):
        try:
            size = int(request.headers.get("content-length") or 0)
        except ValueError:
            size = 0
        if size > MAX_JSON_BODY:
            return JSONResponse(status_code=413, content={"detail": "Request is too large"})
    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def validation_error(request, exc: RequestValidationError):
    # Report only WHERE and WHY a field is wrong - never echo the submitted value back.
    detail = [
        {"loc": [str(p) for p in e.get("loc", ())], "msg": str(e.get("msg", "Invalid value")).replace("Value error, ", "")}
        for e in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": detail})


@app.exception_handler(Exception)
async def unhandled_error(request, exc):
    # Never show internals to the visitor; the details go to the server log.
    logging.getLogger("api").exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def api_root():
    return {
        "message": "JHS API",
        "docs": "/api/docs"
    }

# Include routers
api_router.include_router(contact.router)
api_router.include_router(alumni.router)
api_router.include_router(admin.router)
api_router.include_router(careers.router)
api_router.include_router(articles_router)   # ✅ NEW
api_router.include_router(blogs_router)      # ✅ NEW
api_router.include_router(knowledge_router)  # ✅ NEW
api_router.include_router(whitepaper_router) # ✅ NEW
api_router.include_router(feedback_router)   # ✅ FEEDBACK
api_router.include_router(proposal_router)   # ✅ PROPOSAL
api_router.include_router(excellencia_router) # ✅ NEW
api_router.include_router(newsletter_router) # ✅ NEW
api_router.include_router(regulatory_router) # ✅ NEW
api_router.include_router(appointments_router) # ✅ NEW
api_router.include_router(otp_router)
api_router.include_router(regwatch_router)
api_router.include_router(podcasts_router)
api_router.include_router(notifications_router)
api_router.include_router(consultation_router) # ✅ NEW
api_router.include_router(auth_router)         # ✅ SITE ACCOUNT
api_router.include_router(user_admin_router)   # ✅ SITE ACCOUNT
api_router.include_router(activity_router)     # ✅ SITE ACCOUNT
api_router.include_router(leadership_router)   # ✅ LEADERSHIP
api_router.include_router(catalog_router)      # ✅ SERVICES & SECTORS
api_router.include_router(cookie_consent_router) # ✅ COOKIE CONSENT
api_router.include_router(events_router)       # ✅ EVENTS

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to JHS API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)

