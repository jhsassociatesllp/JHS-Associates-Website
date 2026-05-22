import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "JHS_website"

async def setup_admin_roles():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        
        print(f"🔗 Connecting to MongoDB: {MONGODB_URL}")
        print(f"📊 Database: {DATABASE_NAME}")
        
        # Check if admins collection exists and has data
        existing_count = await db["admins"].count_documents({})
        print(f"📋 Current admins in collection: {existing_count}")
        
        if existing_count > 0:
            print("⚠️  Admins collection already has data. Clearing it first...")
            await db["admins"].delete_many({})
        
        # Create admin users with role-based arrays
        admin_users = [
            # Super Admins (2 users) - Password: superadmin123
            {
                "email": "superadmin1@jhs.com",
                "password": "superadmin123",
                "role": "super_admin",
                "name": "Super Administrator 1",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            {
                "email": "superadmin2@jhs.com",
                "password": "superadmin123",
                "role": "super_admin",
                "name": "Super Administrator 2",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            
            # Regular Admins (2 users) - Password: admin123
            {
                "email": "admin1@jhs.com",
                "password": "admin123", 
                "role": "admin",
                "name": "Content Administrator 1",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            {
                "email": "admin2@jhs.com",
                "password": "admin123", 
                "role": "admin",
                "name": "Content Administrator 2",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            
            # HR Admins (3 users) - Password: hradmin123
            {
                "email": "hradmin1@jhs.com", 
                "password": "hradmin123",
                "role": "hr_admin",
                "name": "HR Administrator 1",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            {
                "email": "hradmin2@jhs.com", 
                "password": "hradmin123",
                "role": "hr_admin",
                "name": "HR Administrator 2",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            },
            {
                "email": "hradmin3@jhs.com", 
                "password": "hradmin123",
                "role": "hr_admin",
                "name": "HR Administrator 3",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            }
        ]
        
        # Insert admin users
        print("📝 Inserting admin users...")
        result = await db["admins"].insert_many(admin_users)
        
        # Verify insertion
        final_count = await db["admins"].count_documents({})
        
        print("\n✅ Admin roles setup completed!")
        print(f"📊 Total admins created: {len(result.inserted_ids)}")
        print(f"📊 Final count in database: {final_count}")
        
        # Group by role for display
        super_admins = [u for u in admin_users if u['role'] == 'super_admin']
        hr_admins = [u for u in admin_users if u['role'] == 'hr_admin']
        regular_admins = [u for u in admin_users if u['role'] == 'admin']
        
        print("\n👥 Created Admin Users:")
        print("=" * 60)
        
        print(f"\n🔴 SUPER ADMINS ({len(super_admins)} users) - Password: superadmin123")
        print("   Access: ALL features (Dashboard, Articles, Blogs, Knowledge, Contacts, Alumni)")
        for user in super_admins:
            print(f"   📧 {user['email']} - {user['name']}")
        
        print(f"\n🟢 CONTENT ADMINS ({len(regular_admins)} users) - Password: admin123")
        print("   Access: Dashboard, Articles, Blogs, Knowledge Resources ONLY")
        for user in regular_admins:
            print(f"   📧 {user['email']} - {user['name']}")
        
        print(f"\n🟡 HR ADMINS ({len(hr_admins)} users) - Password: hradmin123")
        print("   Access: Dashboard, Contacts, Alumni ONLY")
        for user in hr_admins:
            print(f"   📧 {user['email']} - {user['name']}")
        
        print("\n🔐 Role-Based Sidebar Access:")
        print("=" * 60)
        print("🔴 Super Admin: Dashboard + Articles + Blogs + Knowledge + Contacts + Alumni")
        print("🟢 Content Admin: Dashboard + Articles + Blogs + Knowledge (NO Contacts/Alumni)")
        print("🟡 HR Admin: Dashboard + Contacts + Alumni (NO Articles/Blogs/Knowledge)")
        
        print(f"\n🌐 Login URL: http://localhost:5174/login")
        print("📋 Try logging in with any of the above credentials!")
        
        # Verify by counting each role
        super_count = await db["admins"].count_documents({"role": "super_admin"})
        admin_count = await db["admins"].count_documents({"role": "admin"})
        hr_count = await db["admins"].count_documents({"role": "hr_admin"})
        
        print(f"\n🔍 Database Verification:")
        print(f"   🔴 Super Admins: {super_count}")
        print(f"   🟢 Content Admins: {admin_count}")
        print(f"   🟡 HR Admins: {hr_count}")
        print(f"   📊 Total: {super_count + admin_count + hr_count}")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error setting up admin roles: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(setup_admin_roles())