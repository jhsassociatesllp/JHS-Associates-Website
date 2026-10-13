from datetime import date
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse

from app.auth.deps import require_roles
from app.controllers import notify as notify_ctrl
from app.controllers import podcast as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.podcast import PodcastAdmin, PodcastPublic
from app.utils.http import content_disposition

router = APIRouter(prefix="/podcasts", tags=["Podcasts"])

admin_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])


def _fail(exc: ctrl.PodcastError):
    raise HTTPException(status_code=exc.status_code, detail=exc.detail)


def _admin_name(admin: AdminInDB) -> str:
    return str(getattr(admin, "email", None) or getattr(admin, "username", None) or "admin")[:120]


# ── public ───────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[PodcastPublic])
async def list_podcasts(limit: int = 30):
    return await ctrl.list_public(limit)


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    if not await ctrl.published_has_image(image_id):
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        content, filename, ctype = await ctrl.read_image(image_id)
    except ctrl.PodcastError:
        raise HTTPException(status_code=404, detail="Image not found")
    return StreamingResponse(BytesIO(content), media_type=ctype,
                             headers={"Content-Disposition": content_disposition(filename),
                                      "Cache-Control": "public, max-age=86400"})


# ── admin (Admin / Super Admin only) ─────────────────────────────────────────

@router.get("/admin/all", response_model=list[PodcastAdmin])
async def admin_list(admin: AdminInDB = Depends(admin_access)):
    return await ctrl.list_admin()


@router.post("/admin", status_code=status.HTTP_201_CREATED)
async def admin_create(
    title: str = Form(...),
    description: str = Form(...),
    guest: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    platform: str = Form(...),
    listen_url: str = Form(...),
    published_on: Optional[str] = Form(None),
    status_value: str = Form("published", alias="status"),
    image: Optional[UploadFile] = File(None),
    admin: AdminInDB = Depends(admin_access),
):
    image_id = None
    try:
        fields = ctrl.clean_fields(title, description, guest, duration, platform, listen_url,
                                   published_on or date.today().isoformat(), status_value)
        if image and image.filename:
            image_id = await ctrl.upload_image(await image.read(), image.filename)
        created = await ctrl.create(fields, image_id, _admin_name(admin))
        if created.get("status") == "published":
            await notify_ctrl.queue_content("podcast", created["id"], created["title"], created["description"])
        return created
    except ctrl.PodcastError as exc:
        await ctrl.delete_file(image_id)
        _fail(exc)


@router.put("/admin/{item_id}")
async def admin_update(
    item_id: str,
    title: str = Form(...),
    description: str = Form(...),
    guest: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    platform: str = Form(...),
    listen_url: str = Form(...),
    published_on: str = Form(...),
    status_value: str = Form("published", alias="status"),
    image: Optional[UploadFile] = File(None),
    admin: AdminInDB = Depends(admin_access),
):
    image_id = None
    try:
        fields = ctrl.clean_fields(title, description, guest, duration, platform, listen_url, published_on, status_value)
        if image and image.filename:
            image_id = await ctrl.upload_image(await image.read(), image.filename)
        was = await ctrl.current_status(item_id)
        updated = await ctrl.update(item_id, fields, image_id, _admin_name(admin))
        if was == "draft" and updated.get("status") == "published":
            await notify_ctrl.queue_content("podcast", updated["id"], updated["title"], updated["description"])
        return updated
    except ctrl.PodcastError as exc:
        await ctrl.delete_file(image_id)
        _fail(exc)


@router.delete("/admin/{item_id}")
async def admin_delete(item_id: str, admin: AdminInDB = Depends(admin_access)):
    try:
        await ctrl.delete(item_id)
    except ctrl.PodcastError as exc:
        _fail(exc)
    return {"message": "Deleted"}
