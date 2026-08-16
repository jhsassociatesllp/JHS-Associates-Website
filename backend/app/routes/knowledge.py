from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.schemas.knowledge import KnowledgeCreate, KnowledgeUpdate, KnowledgeResponse
from app.controllers import knowledge as knowledge_ctrl
from app.utils.http import content_disposition
from io import BytesIO
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/knowledge", tags=["Knowledge Resources"])


# ── Static sub-paths MUST come before /{knowledge_id} ──────────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_knowledge(
    title: str = Form(...),
    short_description: str = Form(...),
    content: str = Form(...),
    image: UploadFile = File(...),
    pdf: UploadFile = File(...)
):
    """Upload a new knowledge resource with image and PDF (both stored in GridFS)."""
    try:
        image_content = await image.read()
        image_id = await knowledge_ctrl.upload_image_to_gridfs(
            image_content,
            image.filename or "image",
            image.content_type or "image/jpeg"
        )

        pdf_content = await pdf.read()
        pdf_id = await knowledge_ctrl.upload_pdf_to_gridfs(
            pdf_content,
            pdf.filename or "document.pdf"
        )

        knowledge_data = KnowledgeCreate(
            title=title,
            short_description=short_description,
            content=content,
            image_id=image_id,
            pdf_id=pdf_id
        )
        created = await knowledge_ctrl.create_knowledge(knowledge_data)
        return {"message": "Knowledge resource created successfully", "knowledge": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    """Stream image from GridFS."""
    try:
        content, filename, content_type = await knowledge_ctrl.get_file_from_gridfs(image_id)
        return StreamingResponse(
            BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": content_disposition(filename),
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str):
    """Stream PDF from GridFS."""
    try:
        content, filename, _ = await knowledge_ctrl.get_file_from_gridfs(pdf_id)
        return StreamingResponse(
            BytesIO(content),
            media_type="application/pdf",
            headers={"Content-Disposition": content_disposition(filename),
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="PDF not found")


@router.get("/")
async def list_knowledge():
    """Return all knowledge resources sorted by newest first."""
    try:
        return await knowledge_ctrl.get_all_knowledge()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{knowledge_id}")
async def get_knowledge(knowledge_id: str):
    knowledge = await knowledge_ctrl.get_knowledge_by_id(knowledge_id)
    if not knowledge:
        raise HTTPException(status_code=404, detail="Knowledge resource not found")
    return knowledge


@router.put("/{knowledge_id}", status_code=status.HTTP_200_OK)
async def update_knowledge(
    knowledge_id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    edited_by: str = Form(...),
    image: Optional[UploadFile] = File(None),
    pdf: Optional[UploadFile] = File(None)
):
    """Update an existing knowledge resource. Tracks edit history."""
    try:
        update_data = KnowledgeUpdate(edited_by=edited_by)

        if title:            update_data.title = title
        if short_description: update_data.short_description = short_description
        if content:          update_data.content = content

        if image and image.filename:
            img_bytes = await image.read()
            update_data.image_id = await knowledge_ctrl.upload_image_to_gridfs(
                img_bytes, image.filename, image.content_type or "image/jpeg")

        if pdf and pdf.filename:
            pdf_bytes = await pdf.read()
            update_data.pdf_id = await knowledge_ctrl.upload_pdf_to_gridfs(
                pdf_bytes, pdf.filename)

        updated = await knowledge_ctrl.update_knowledge(knowledge_id, update_data)
        return {"message": "Knowledge resource updated successfully", "knowledge": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{knowledge_id}", status_code=status.HTTP_200_OK)
async def remove_knowledge(knowledge_id: str):
    deleted = await knowledge_ctrl.delete_knowledge(knowledge_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Knowledge resource not found")
    return {"message": "Knowledge resource deleted successfully"}