import asyncio
from app.database.connection import connect_to_mongo, close_mongo_connection, get_database
from app.auth.security import get_password_hash

async def create_default_admin():
    await connect_to_mongo()
    db = get_database()
    
    email = "admin@jhsassociates.in"
    password = "admin" # Simple default password
    
    existing_admin = await db["admins"].find_one({"email": email})
    if existing_admin:
        print(f"Admin with email {email} already exists.")
    else:
        hashed_password = get_password_hash(password)
        admin_data = {
            "email": email,
            "hashed_password": hashed_password
        }
        await db["admins"].insert_one(admin_data)
        print(f"Created default admin with email: {email} and password: {password}")

    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(create_default_admin())
