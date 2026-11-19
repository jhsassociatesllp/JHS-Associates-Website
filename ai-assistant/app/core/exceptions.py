"""Application errors with sanitised public messages (internal detail goes to logs only)."""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

log = get_logger("errors")


class AppError(Exception):
    status_code = 500
    code = "internal_error"
    public_message = "Something went wrong. Please try again."

    def __init__(self, detail: str = "", public_message: str | None = None):
        super().__init__(detail or self.public_message)
        if public_message:
            self.public_message = public_message


class AccessDenied(AppError):
    status_code = 403
    code = "access_denied"
    public_message = "That information is not available."


class NotFound(AppError):
    status_code = 404
    code = "not_found"
    public_message = "Not found."


class BadRequest(AppError):
    status_code = 400
    code = "bad_request"
    public_message = "Invalid request."


class RateLimited(AppError):
    status_code = 429
    code = "rate_limited"
    public_message = "Too many requests. Please wait a moment and try again."


class UpstreamError(AppError):
    status_code = 502
    code = "upstream_error"
    public_message = "The assistant is temporarily unavailable. Please try again shortly."


def install_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _app_error(_: Request, exc: AppError):
        if exc.status_code >= 500:
            log.error("app_error", exc_info=exc, extra={"ctx": {"code": exc.code}})
        return JSONResponse(status_code=exc.status_code, content={"error": exc.public_message, "code": exc.code})

    @app.exception_handler(Exception)
    async def _unhandled(_: Request, exc: Exception):
        log.error("unhandled_error", exc_info=exc)
        return JSONResponse(status_code=500, content={"error": AppError.public_message, "code": "internal_error"})
