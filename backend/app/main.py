from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.routes import contact, alumni, admin, careers
from app.routes.articles import router as articles_router   # ✅ NEW
from app.routes.blogs import router as blogs_router         # ✅ NEW
from app.routes.knowledge import router as knowledge_router # ✅ NEW
from app.routes.feedback import router as feedback_router   # ✅ FEEDBACK
from app.routes.proposal import router as proposal_router   # ✅ PROPOSAL


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="JHS Associates Backend",
    description="FastAPI Backend for JHS Associates Website",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redirect_slashes=True
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # Allow credentials for authentication
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def api_root():
    return {
        "message": "JHS Associates API",
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
api_router.include_router(feedback_router)   # ✅ FEEDBACK
api_router.include_router(proposal_router)   # ✅ PROPOSAL

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to JHS Associates API"}
