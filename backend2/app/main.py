from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.routes import contact, alumni, admin
from app.routes.articles import router as articles_router   # ✅ NEW
from app.routes.blogs import router as blogs_router         # ✅ NEW

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
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact.router)
app.include_router(alumni.router)
app.include_router(admin.router)
app.include_router(articles_router)   # ✅ NEW
app.include_router(blogs_router)      # ✅ NEW

@app.get("/")
async def root():
    return {"message": "Welcome to JHS Associates API"}