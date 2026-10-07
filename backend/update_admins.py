import asyncio
import os
from app.database.connection import connect_to_mongo, close_mongo_connection, get_database

async def update_admins():
    await connect_to_mongo()
    db = get_database()
    
    # Delete existing admin with hashed password
    await db["admins"].delete_many({})
    print("Deleted existing admin documents")
    
    # Define the new admin emails and common password
    emails = [
        "maaz.quraishi@jhsassociates.in",
        "vasu.gadde@jhsassociates.in"
    ]
    password = os.environ["ADMIN_BOOTSTRAP_PASSWORD"]  # set in your environment, never commit it
    
    # Insert single admin document with emails array and plain password
    admin_data = {
        "emails": emails,  # Array of emails
        "password": password  # Single password for all emails
    }
    await db["admins"].insert_one(admin_data)
    print(f"Created single admin entry with emails: {emails} (password taken from ADMIN_BOOTSTRAP_PASSWORD)")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(update_admins())
