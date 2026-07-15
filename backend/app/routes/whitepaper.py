from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.schemas.whitepaper import WhitePaperCreate, WhitePaperUpdate, WhitePaperResponse
from app.controllers import whitepaper as whitepaper_ctrl
from io import BytesIO
from typing import Optional

router = APIRouter(prefix="/whitepapers", tags=["White Papers"])


# ── Static sub-paths MUST come before /{whitepaper_id} ──────────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_whitepaper(
    title: str = Form(...),
    short_description: str = Form(...),
    pdf: UploadFile = File(...),
    image: Optional[UploadFile] = File(None)
):
    """Upload a new white paper with a PDF and optional cover image (stored in GridFS)."""
    try:
        pdf_content = await pdf.read()
        pdf_id = await whitepaper_ctrl.upload_pdf_to_gridfs(
            pdf_content,
            pdf.filename or "document.pdf"
        )

        image_id = None
        if image and image.filename:
            image_content = await image.read()
            image_id = await whitepaper_ctrl.upload_image_to_gridfs(
                image_content,
                image.filename,
                image.content_type
            )

        whitepaper_data = WhitePaperCreate(
            title=title,
            short_description=short_description,
            pdf_id=pdf_id,
            image_id=image_id
        )
        created = await whitepaper_ctrl.create_whitepaper(whitepaper_data)
        return {"message": "White paper created successfully", "whitepaper": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str):
    """Stream PDF from GridFS."""
    try:
        content, filename, _ = await whitepaper_ctrl.get_file_from_gridfs(pdf_id)
        return StreamingResponse(
            BytesIO(content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={filename}",
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="PDF not found")


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    """Stream cover image from GridFS."""
    try:
        content, filename, content_type = await whitepaper_ctrl.get_file_from_gridfs(image_id)
        return StreamingResponse(
            BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}",
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.get("/")
async def list_whitepapers():
    """Return all white papers sorted by newest first."""
    try:
        return await whitepaper_ctrl.get_all_whitepapers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{whitepaper_id}")
async def get_whitepaper(whitepaper_id: str):
    whitepaper = await whitepaper_ctrl.get_whitepaper_by_id(whitepaper_id)
    if not whitepaper:
        raise HTTPException(status_code=404, detail="White paper not found")
    return whitepaper


@router.put("/{whitepaper_id}", status_code=status.HTTP_200_OK)
async def update_whitepaper(
    whitepaper_id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    edited_by: str = Form(...),
    pdf: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None)
):
    """Update an existing white paper. Tracks edit history."""
    try:
        update_data = WhitePaperUpdate(edited_by=edited_by)

        if title:              update_data.title = title
        if short_description:  update_data.short_description = short_description

        if pdf and pdf.filename:
            pdf_bytes = await pdf.read()
            update_data.pdf_id = await whitepaper_ctrl.upload_pdf_to_gridfs(
                pdf_bytes, pdf.filename)

        if image and image.filename:
            image_bytes = await image.read()
            update_data.image_id = await whitepaper_ctrl.upload_image_to_gridfs(
                image_bytes, image.filename, image.content_type)

        updated = await whitepaper_ctrl.update_whitepaper(whitepaper_id, update_data)
        return {"message": "White paper updated successfully", "whitepaper": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{whitepaper_id}", status_code=status.HTTP_200_OK)
async def remove_whitepaper(whitepaper_id: str):
    deleted = await whitepaper_ctrl.delete_whitepaper(whitepaper_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="White paper not found")
    return {"message": "White paper deleted successfully"}
