import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from datetime import datetime

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "JHS_website"

async def check_admin_data():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        
        print("🔍 Checking Admin Data in MongoDB")
        print("=" * 50)
        
        # Count total admins
        total_count = await db["admins"].count_documents({})
        print(f"📊 Total Admins: {total_count}")
        
        if total_count == 0:
            print("❌ No admin data found!")
            return
        
        # Get all admins
        print("\n👥 Admin Users:")
        print("-" * 50)
        
        cursor = db["admins"].find({})
        admin_number = 1
        
        async for admin in cursor:
            print(f"\n{admin_number}. Admin Details:")
            print(f"   🆔 ID: {admin['_id']}")
            print(f"   📧 Email: {admin['email']}")
            print(f"   👤 Name: {admin['name']}")
            print(f"   🔑 Role: {admin['role']}")
            print(f"   🔒 Password: {admin['password']}")
            print(f"   📅 Created: {admin['created_at']}")
            print(f"   🕐 Last Login: {admin.get('last_login', 'Never')}")
            
            admin_number += 1
        
        # Count by role
        print(f"\n📈 Admin Statistics:")
        print("-" * 30)
        
        super_admin_count = await db["admins"].count_documents({"role": "super_admin"})
        hr_admin_count = await db["admins"].count_documents({"role": "hr_admin"})
        admin_count = await db["admins"].count_documents({"role": "admin"})
        
        print(f"🔴 Super Admins: {super_admin_count}")
        print(f"🟡 HR Admins: {hr_admin_count}")
        print(f"🟢 Regular Admins: {admin_count}")
        
        # Test login credentials
        print(f"\n🔐 Test Login Credentials:")
        print("-" * 30)
        print("You can use these credentials to login:")
        print("1. Super Admin: superadmin@jhs.com / superadmin123")
        print("2. HR Admin: hradmin@jhs.com / hradmin123")
        print("3. Content Admin: admin@jhs.com / admin123")
        
        print(f"\n🌐 Login URL: http://localhost:5174/login")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error checking admin data: {e}")

if __name__ == "__main__":
    asyncio.run(check_admin_data())