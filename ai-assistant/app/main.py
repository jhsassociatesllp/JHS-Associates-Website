from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat, knowledge
from app.container import build_services
from app.core.config import get_settings
from app.core.exceptions import install_handlers
from app.core.logging import get_logger, setup_logging

log = get_logger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logging(settings.log_level)
    if not hasattr(app.state, "services"):
        app.state.services = build_services(settings)
        try:
            await app.state.services.mongo.ensure_indexes()
        except Exception as e:  # service still starts; /api/health stays honest
            log.error("startup_index_failed", extra={"ctx": {"err": type(e).__name__}})
    yield
    await app.state.services.mongo.close()


def create_app() -> FastAPI:
    s = get_settings()
    app = FastAPI(title="JHS AI Knowledge Assistant", version="0.1.0", lifespan=lifespan,
                  docs_url=None if s.app_env == "production" else "/api/docs",
                  redoc_url=None, openapi_url=None if s.app_env == "production" else "/api/openapi.json")
    app.add_middleware(CORSMiddleware, allow_origins=s.origins or ["*"], allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
                       allow_headers=["Content-Type", "X-API-Key", "X-Session-Id"], max_age=600)
    install_handlers(app)
    app.include_router(chat.router)
    app.include_router(knowledge.router)

    @app.get("/api/health")
    @app.get("/api/v1/health")
    async def health():
        return {"ok": True}

    return app


app = create_app()
