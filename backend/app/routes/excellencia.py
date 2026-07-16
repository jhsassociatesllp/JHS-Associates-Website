from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.schemas.excellencia import ExcellenciaCreate, ExcellenciaUpdate, ExcellenciaResponse
from app.controllers import excellencia as excellencia_ctrl
from io import BytesIO
from typing import Optional

router = APIRouter(prefix="/excellencia", tags=["Excellencia"])


# ── Static sub-paths MUST come before /{excellencia_id} ──────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_excellencia(
    heading: str = Form(...),
    short_description: str = Form(...),
    button_text: Optional[str] = Form(None),
    button_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """Create a new Excellencia entry with an optional image (stored in GridFS)."""
    try:
        image_id = None
        if image and image.filename:
            image_content = await image.read()
            image_id = await excellencia_ctrl.upload_image_to_gridfs(
                image_content,
                image.filename,
                image.content_type
            )

        excellencia_data = ExcellenciaCreate(
            heading=heading,
            short_description=short_description,
            image_id=image_id,
            button_text=button_text,
            button_url=button_url
        )
        created = await excellencia_ctrl.create_excellencia(excellencia_data)
        return {"message": "Excellencia entry created successfully", "excellencia": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    """Stream image from GridFS."""
    try:
        content, filename, content_type = await excellencia_ctrl.get_file_from_gridfs(image_id)
        return StreamingResponse(
            BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}",
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.get("/")
async def list_excellencia():
    """Return all Excellencia entries sorted by newest first."""
    try:
        return await excellencia_ctrl.get_all_excellencia()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{excellencia_id}")
async def get_excellencia(excellencia_id: str):
    entry = await excellencia_ctrl.get_excellencia_by_id(excellencia_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Excellencia entry not found")
    return entry


@router.put("/{excellencia_id}", status_code=status.HTTP_200_OK)
async def update_excellencia(
    excellencia_id: str,
    heading: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    button_text: Optional[str] = Form(None),
    button_url: Optional[str] = Form(None),
    edited_by: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """Update an existing Excellencia entry. Tracks edit history."""
    try:
        update_data = ExcellenciaUpdate(edited_by=edited_by)

        if heading:             update_data.heading = heading
        if short_description:   update_data.short_description = short_description
        if button_text is not None: update_data.button_text = button_text
        if button_url is not None:  update_data.button_url = button_url

        if image and image.filename:
            image_bytes = await image.read()
            update_data.image_id = await excellencia_ctrl.upload_image_to_gridfs(
                image_bytes, image.filename, image.content_type)

        updated = await excellencia_ctrl.update_excellencia(excellencia_id, update_data)
        return {"message": "Excellencia entry updated successfully", "excellencia": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{excellencia_id}", status_code=status.HTTP_200_OK)
async def remove_excellencia(excellencia_id: str):
    deleted = await excellencia_ctrl.delete_excellencia(excellencia_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Excellencia entry not found")
    return {"message": "Excellencia entry deleted successfully"}
