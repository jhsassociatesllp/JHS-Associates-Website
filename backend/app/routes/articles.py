from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from fastapi.responses import StreamingResponse
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleResponse
from app.controllers import article as article_ctrl
from app.auth.deps import require_admin_or_above
from app.utils.http import content_disposition
from app.schemas.admin import AdminInDB
from io import BytesIO
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/articles", tags=["Articles"])


# ── Static sub-paths MUST come before /{article_id} ──────────────────────────

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def add_article(
    title: str = Form(...),
    short_description: str = Form(...),
    content: str = Form(...),
    author: str = Form(...),
    publish_date: str = Form(...),
    image: UploadFile = File(...),
    pdf: UploadFile = File(...),
    current_admin: AdminInDB = Depends(require_admin_or_above)
):
    """Upload a new article with image and PDF (both stored in GridFS)."""
    try:
        image_content = await image.read()
        image_id = await article_ctrl.upload_image_to_gridfs(
            image_content,
            image.filename or "image",
            image.content_type or "image/jpeg"
        )

        pdf_content = await pdf.read()
        pdf_id = await article_ctrl.upload_pdf_to_gridfs(
            pdf_content,
            pdf.filename or "document.pdf"
        )

        try:
            parsed_date = datetime.fromisoformat(publish_date.replace('Z', '+00:00'))
        except Exception:
            parsed_date = datetime.utcnow()

        article_data = ArticleCreate(
            title=title,
            short_description=short_description,
            content=content,
            author=author,
            image_id=image_id,
            pdf_id=pdf_id,
            publish_date=parsed_date
        )
        created = await article_ctrl.create_article(article_data)
        return {"message": "Article created successfully", "article": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image/{image_id}")
async def get_image(image_id: str):
    """Stream image from GridFS."""
    try:
        content, filename, content_type = await article_ctrl.get_file_from_gridfs(image_id)
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
        content, filename, _ = await article_ctrl.get_file_from_gridfs(pdf_id)
        return StreamingResponse(
            BytesIO(content),
            media_type="application/pdf",
            headers={"Content-Disposition": content_disposition(filename),
                     "Cache-Control": "public, max-age=86400"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="PDF not found")


@router.get("/")
async def list_articles():
    """Return all articles sorted by newest first."""
    try:
        return await article_ctrl.get_all_articles()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Dynamic paths AFTER all static ones ──────────────────────────────────────

@router.get("/{article_id}")
async def get_article(article_id: str):
    article = await article_ctrl.get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.put("/{article_id}", status_code=status.HTTP_200_OK)
async def update_article(
    article_id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    publish_date: Optional[str] = Form(None),
    edited_by: str = Form(...),
    image: Optional[UploadFile] = File(None),
    pdf: Optional[UploadFile] = File(None),
    current_admin: AdminInDB = Depends(require_admin_or_above)
):
    """Update an existing article. Tracks edit history."""
    try:
        update_data = ArticleUpdate(edited_by=edited_by)

        if title:            update_data.title = title
        if short_description: update_data.short_description = short_description
        if content:          update_data.content = content
        if author:           update_data.author = author
        if publish_date:
            try:
                update_data.publish_date = datetime.fromisoformat(
                    publish_date.replace('Z', '+00:00'))
            except Exception:
                pass

        if image and image.filename:
            img_bytes = await image.read()
            update_data.image_id = await article_ctrl.upload_image_to_gridfs(
                img_bytes, image.filename, image.content_type or "image/jpeg")

        if pdf and pdf.filename:
            pdf_bytes = await pdf.read()
            update_data.pdf_id = await article_ctrl.upload_pdf_to_gridfs(
                pdf_bytes, pdf.filename)

        updated = await article_ctrl.update_article(article_id, update_data)
        return {"message": "Article updated successfully", "article": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{article_id}", status_code=status.HTTP_200_OK)
async def remove_article(
    article_id: str,
    current_admin: AdminInDB = Depends(require_admin_or_above)
):
    deleted = await article_ctrl.delete_article(article_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}
