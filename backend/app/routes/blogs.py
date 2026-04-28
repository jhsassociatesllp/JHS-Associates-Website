from fastapi import APIRouter, HTTPException, status
from app.schemas.blog import BlogCreate, BlogResponse
from app.controllers import blog as blog_ctrl

router = APIRouter(prefix="/blogs", tags=["Blogs"])


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_blog(data: BlogCreate):
    """
    Save a new blog post.
    If an image is used, upload to Firebase first and pass its URL in `image_url`.
    """
    try:
        created = await blog_ctrl.create_blog(data)
        return {"message": "Blog created successfully", "blog": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list)
async def list_blogs():
    """Return all blogs sorted by newest first."""
    try:
        return await blog_ctrl.get_all_blogs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{blog_id}", response_model=dict)
async def get_blog(blog_id: str):
    blog = await blog_ctrl.get_blog_by_id(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@router.delete("/{blog_id}", status_code=status.HTTP_200_OK)
async def remove_blog(blog_id: str):
    deleted = await blog_ctrl.delete_blog(blog_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}