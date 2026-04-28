from app.database.connection import get_database
from app.schemas.alumni import AlumniCreate, AlumniResponse
from datetime import datetime, timezone

async def create_alumni_registration(alumni: AlumniCreate) -> AlumniResponse:
    db = get_database()
    collection = db["alumni"]
    
    # Prepare document
    alumni_dict = alumni.model_dump()
    alumni_dict["created_at"] = datetime.now(timezone.utc)
    
    # Insert into MongoDB
    result = await collection.insert_one(alumni_dict)
    
    # Return response
    alumni_dict["id"] = str(result.inserted_id)
    return AlumniResponse(**alumni_dict)

async def get_all_alumni() -> list[AlumniResponse]:
    db = get_database()
    collection = db["alumni"]
    
    alumni_list = []
    cursor = collection.find({}).sort("created_at", -1)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        alumni_list.append(AlumniResponse(**document))
        
    return alumni_list
