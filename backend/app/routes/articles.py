from fastapi import APIRouter, HTTPException, status
from app.schemas.article import ArticleCreate, ArticleResponse
from app.controllers import article as article_ctrl

router = APIRouter(prefix="/articles", tags=["Articles"])


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_article(data: ArticleCreate):
    """
    Save a new article.
    The PDF is already uploaded to Firebase by the frontend;
    pass its download URL in `pdf_url`.
    """
    try:
        created = await article_ctrl.create_article(data)
        return {"message": "Article created successfully", "article": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list)
async def list_articles():
    """Return all articles sorted by newest first."""
    try:
        return await article_ctrl.get_all_articles()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{article_id}", response_model=dict)
async def get_article(article_id: str):
    article = await article_ctrl.get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.delete("/{article_id}", status_code=status.HTTP_200_OK)
async def remove_article(article_id: str):
    deleted = await article_ctrl.delete_article(article_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}