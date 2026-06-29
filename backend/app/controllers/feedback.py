from app.database.connection import get_database
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services.email_service import notify_hr_new_feedback
from datetime import datetime, timezone

async def create_feedback(feedback: FeedbackCreate) -> FeedbackResponse:
    db = get_database()
    collection = db["feedback"]
    
    # Prepare document
    feedback_dict = feedback.model_dump()
    feedback_dict["created_at"] = datetime.now(timezone.utc)
    
    # Insert into MongoDB
    result = await collection.insert_one(feedback_dict)
    
    # Send email notifications (fire-and-forget)
    await notify_hr_new_feedback(feedback_dict)
    
    # Return response
    feedback_dict["id"] = str(result.inserted_id)
    return FeedbackResponse(**feedback_dict)

async def get_all_feedbacks() -> list[FeedbackResponse]:
    db = get_database()
    collection = db["feedback"]
    
    feedbacks = []
    cursor = collection.find({}).sort("created_at", -1)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        feedbacks.append(FeedbackResponse(**document))
        
    return feedbacks

async def get_feedback_by_id(feedback_id: str) -> FeedbackResponse:
    from bson import ObjectId
    db = get_database()
    collection = db["feedback"]
    
    document = await collection.find_one({"_id": ObjectId(feedback_id)})
    if document:
        document["id"] = str(document["_id"])
        return FeedbackResponse(**document)
    return None

async def delete_feedback(feedback_id: str) -> bool:
    from bson import ObjectId
    db = get_database()
    collection = db["feedback"]
    
    result = await collection.delete_one({"_id": ObjectId(feedback_id)})
    return result.deleted_count > 0
