from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.schemas.regulatory import RegulatoryCreate, RegulatoryUpdate, RegulatoryResponse
from app.controllers import regulatory as regulatory_ctrl
from io import BytesIO
from typing import Optional

router = APIRouter(prefix="/regulatory", tags=["Regulatory"])


# ── Static sub-paths MUST come before /{regulatory_id} ──────────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_regulatory(
    title: str = Form(...),
    short_description: str = Form(...),
    pdf: UploadFile = File(...),
    image: Optional[UploadFile] = File(None)
):
    """Upload a new regulatory document with a PDF and optional cover image (stored in GridFS)."""
    try:
        pdf_content = await pdf.read()
        pdf_id = await regulatory_ctrl.upload_pdf_to_gridfs(
            pdf_content,
            pdf.filename or "document.pdf"
        )

        image_id = None
        if image and image.filename:
            image_content = await image.read()
            image_id = await regulatory_ctrl.upload_image_to_gridfs(
                image_content,
                image.filename,
                image.content_type
            )

        regulatory_data = RegulatoryCreate(
            title=title,
            short_description=short_description,
            pdf_id=pdf_id,
            image_id=image_id
        )
        created = await regulatory_ctrl.create_regulatory(regulatory_data)
        return {"message": "Regulatory created successfully", "regulatory": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str):
    """Stream PDF from GridFS."""
    try:
        content, filename, _ = await regulatory_ctrl.get_file_from_gridfs(pdf_id)
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
        content, filename, content_type = await regulatory_ctrl.get_file_from_gridfs(image_id)
        return StreamingResponse(
            BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}",
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.get("/")
async def list_regulatory():
    """Return all regulatory documents sorted by newest first."""
    try:
        return await regulatory_ctrl.get_all_regulatory()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{regulatory_id}")
async def get_regulatory(regulatory_id: str):
    regulatory = await regulatory_ctrl.get_regulatory_by_id(regulatory_id)
    if not regulatory:
        raise HTTPException(status_code=404, detail="Regulatory not found")
    return regulatory


@router.put("/{regulatory_id}", status_code=status.HTTP_200_OK)
async def update_regulatory(
    regulatory_id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    edited_by: str = Form(...),
    pdf: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None)
):
    """Update an existing regulatory document. Tracks edit history."""
    try:
        update_data = RegulatoryUpdate(edited_by=edited_by)

        if title:              update_data.title = title
        if short_description:  update_data.short_description = short_description

        if pdf and pdf.filename:
            pdf_bytes = await pdf.read()
            update_data.pdf_id = await regulatory_ctrl.upload_pdf_to_gridfs(
                pdf_bytes, pdf.filename)

        if image and image.filename:
            image_bytes = await image.read()
            update_data.image_id = await regulatory_ctrl.upload_image_to_gridfs(
                image_bytes, image.filename, image.content_type)

        updated = await regulatory_ctrl.update_regulatory(regulatory_id, update_data)
        return {"message": "Regulatory updated successfully", "regulatory": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{regulatory_id}", status_code=status.HTTP_200_OK)
async def remove_regulatory(regulatory_id: str):
    deleted = await regulatory_ctrl.delete_regulatory(regulatory_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Regulatory not found")
    return {"message": "Regulatory deleted successfully"}
