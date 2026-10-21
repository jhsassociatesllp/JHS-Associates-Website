from datetime import date
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse

from app.auth.deps import get_current_user, require_roles
from app.controllers import activity as activity_ctrl
from app.controllers import notify as notify_ctrl
from app.controllers import regwatch as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.regwatch import RegWatchAdmin, RegWatchPublic
from app.utils.http import content_disposition

router = APIRouter(prefix="/reg-watch", tags=["Reg-Watch"])

admin_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])


def _fail(exc: ctrl.RegWatchError):
    raise HTTPException(status_code=exc.status_code, detail=exc.detail)


def _admin_name(admin: AdminInDB) -> str:
    return str(getattr(admin, "email", None) or getattr(admin, "username", None) or "admin")[:120]


# ── public ───────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[RegWatchPublic])
async def list_reg_watch(limit: int = 30, regulator: Optional[str] = None):
    return await ctrl.list_public(limit, regulator)


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    if not await ctrl.find_published_by_file("image_id", image_id):
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        content, filename, ctype = await ctrl.read_file(image_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
    return StreamingResponse(BytesIO(content), media_type=ctype,
                             headers={"Content-Disposition": content_disposition(filename),
                                      "Cache-Control": "public, max-age=86400"})


@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str, user: dict = Depends(get_current_user)):
    """Signed-in visitors only (same rule as White Papers / Regulatory); logs a download."""
    item = await ctrl.find_published_by_file("pdf_id", pdf_id)
    if not item:
        raise HTTPException(status_code=404, detail="PDF not found")
    try:
        content, filename, _ = await ctrl.read_file(pdf_id)
    except Exception:
        raise HTTPException(status_code=404, detail="PDF not found")
    try:
        await activity_ctrl.log_download(user, "reg_watch", pdf_id, item.get("title") or filename)
    except Exception:
        pass
    return StreamingResponse(BytesIO(content), media_type="application/pdf",
                             headers={"Content-Disposition": content_disposition(filename),
                                      "Cache-Control": "private, max-age=3600"})


# ── admin (Admin / Super Admin only) ─────────────────────────────────────────

@router.get("/admin/all", response_model=list[RegWatchAdmin])
async def admin_list(admin: AdminInDB = Depends(admin_access)):
    return await ctrl.list_admin()


@router.get("/admin/{item_id}/pdf")
async def admin_pdf(item_id: str, admin: AdminInDB = Depends(admin_access)):
    """Lets an admin preview the uploaded PDF (including drafts)."""
    try:
        item = await ctrl.get_database()[ctrl.COLLECTION].find_one({"_id": ctrl._oid(item_id)}, {"pdf_id": 1})
        if not item:
            raise ctrl.RegWatchError(404, "Not found")
        content, filename, _ = await ctrl.read_file(item["pdf_id"])
    except ctrl.RegWatchError as exc:
        _fail(exc)
    return StreamingResponse(BytesIO(content), media_type="application/pdf",
                             headers={"Content-Disposition": content_disposition(filename),
                                      "Cache-Control": "no-store"})


@router.post("/admin", status_code=status.HTTP_201_CREATED)
async def admin_create(
    title: str = Form(...),
    summary: str = Form(...),
    regulator: str = Form(...),
    reference: Optional[str] = Form(None),
    published_on: Optional[str] = Form(None),
    status_value: str = Form("published", alias="status"),
    pdf: UploadFile = File(...),
    image: Optional[UploadFile] = File(None),
    admin: AdminInDB = Depends(admin_access),
):
    pdf_id = image_id = None
    try:
        fields = ctrl.clean_fields(title, summary, regulator, reference, published_on or date.today().isoformat(), status_value)
        pdf_id = await ctrl.upload_pdf(await pdf.read(), pdf.filename or "document.pdf")
        if image and image.filename:
            image_id = await ctrl.upload_image(await image.read(), image.filename, image.content_type)
        created = await ctrl.create(fields, pdf_id, image_id, _admin_name(admin))
        if created.get("status") == "published":
            await notify_ctrl.queue_content("reg_watch", created["id"], created["title"], created["summary"])
        return created
    except ctrl.RegWatchError as exc:
        await ctrl._delete_file(pdf_id)
        await ctrl._delete_file(image_id)
        _fail(exc)


@router.put("/admin/{item_id}")
async def admin_update(
    item_id: str,
    title: str = Form(...),
    summary: str = Form(...),
    regulator: str = Form(...),
    reference: Optional[str] = Form(None),
    published_on: str = Form(...),
    status_value: str = Form("published", alias="status"),
    pdf: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    admin: AdminInDB = Depends(admin_access),
):
    pdf_id = image_id = None
    try:
        fields = ctrl.clean_fields(title, summary, regulator, reference, published_on, status_value)
        if pdf and pdf.filename:
            pdf_id = await ctrl.upload_pdf(await pdf.read(), pdf.filename)
        if image and image.filename:
            image_id = await ctrl.upload_image(await image.read(), image.filename, image.content_type)
        was = await ctrl.current_status(item_id)
        updated = await ctrl.update(item_id, fields, pdf_id, image_id, _admin_name(admin))
        if was == "draft" and updated.get("status") == "published":   # only when a draft goes live, never for ordinary edits
            await notify_ctrl.queue_content("reg_watch", updated["id"], updated["title"], updated["summary"])
        return updated
    except ctrl.RegWatchError as exc:
        await ctrl._delete_file(pdf_id)
        await ctrl._delete_file(image_id)
        _fail(exc)


@router.delete("/admin/{item_id}")
async def admin_delete(item_id: str, admin: AdminInDB = Depends(admin_access)):
    try:
        await ctrl.delete(item_id)
    except ctrl.RegWatchError as exc:
        _fail(exc)
    return {"message": "Deleted"}
