from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.schemas.newsletter import NewsletterCreate, NewsletterUpdate, NewsletterResponse
from app.controllers import newsletter as newsletter_ctrl
from io import BytesIO
from typing import Optional

router = APIRouter(prefix="/newsletters", tags=["Newsletters"])


# ── Static sub-paths MUST come before /{newsletter_id} ──────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_newsletter(
    heading: str = Form(...),
    short_description: str = Form(...),
    pdf: UploadFile = File(...),
    image: Optional[UploadFile] = File(None)
):
    """Upload a new newsletter with a PDF and optional cover image (stored in GridFS)."""
    try:
        pdf_content = await pdf.read()
        pdf_id = await newsletter_ctrl.upload_pdf_to_gridfs(
            pdf_content,
            pdf.filename or "document.pdf"
        )

        image_id = None
        if image and image.filename:
            image_content = await image.read()
            image_id = await newsletter_ctrl.upload_image_to_gridfs(
                image_content,
                image.filename,
                image.content_type
            )

        newsletter_data = NewsletterCreate(
            heading=heading,
            short_description=short_description,
            pdf_id=pdf_id,
            image_id=image_id
        )
        created = await newsletter_ctrl.create_newsletter(newsletter_data)
        return {"message": "Newsletter created successfully", "newsletter": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str):
    """Stream PDF from GridFS."""
    try:
        content, filename, _ = await newsletter_ctrl.get_file_from_gridfs(pdf_id)
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
        content, filename, content_type = await newsletter_ctrl.get_file_from_gridfs(image_id)
        return StreamingResponse(
            BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}",
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.get("/")
async def list_newsletters():
    """Return all newsletters sorted by newest first."""
    try:
        return await newsletter_ctrl.get_all_newsletters()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{newsletter_id}")
async def get_newsletter(newsletter_id: str):
    newsletter = await newsletter_ctrl.get_newsletter_by_id(newsletter_id)
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    return newsletter


@router.put("/{newsletter_id}", status_code=status.HTTP_200_OK)
async def update_newsletter(
    newsletter_id: str,
    heading: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    edited_by: str = Form(...),
    pdf: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None)
):
    """Update an existing newsletter. Tracks edit history."""
    try:
        update_data = NewsletterUpdate(edited_by=edited_by)

        if heading:            update_data.heading = heading
        if short_description:  update_data.short_description = short_description

        if pdf and pdf.filename:
            pdf_bytes = await pdf.read()
            update_data.pdf_id = await newsletter_ctrl.upload_pdf_to_gridfs(
                pdf_bytes, pdf.filename)

        if image and image.filename:
            image_bytes = await image.read()
            update_data.image_id = await newsletter_ctrl.upload_image_to_gridfs(
                image_bytes, image.filename, image.content_type)

        updated = await newsletter_ctrl.update_newsletter(newsletter_id, update_data)
        return {"message": "Newsletter updated successfully", "newsletter": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{newsletter_id}", status_code=status.HTTP_200_OK)
async def remove_newsletter(newsletter_id: str):
    deleted = await newsletter_ctrl.delete_newsletter(newsletter_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    return {"message": "Newsletter deleted successfully"}
