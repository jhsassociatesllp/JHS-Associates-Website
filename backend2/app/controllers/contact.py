from app.database.connection import get_database
from app.schemas.contact import ContactCreate, ContactResponse
from datetime import datetime, timezone

async def create_contact_message(contact: ContactCreate) -> ContactResponse:
    db = get_database()
    collection = db["contact_us"]
    
    # Prepare document
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = datetime.now(timezone.utc)
    
    # Insert into MongoDB
    result = await collection.insert_one(contact_dict)
    
    # Return response
    contact_dict["id"] = str(result.inserted_id)
    return ContactResponse(**contact_dict)

async def get_all_contacts() -> list[ContactResponse]:
    db = get_database()
    collection = db["contact_us"]
    
    contacts = []
    cursor = collection.find({}).sort("created_at", -1)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        contacts.append(ContactResponse(**document))
        
    return contacts
