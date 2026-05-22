import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "JHS_website"

async def verify_role_access():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        
        print("🔍 ROLE-BASED ACCESS VERIFICATION")
        print("=" * 60)
        
        # Get all admins grouped by role
        super_admins = []
        hr_admins = []
        content_admins = []
        
        cursor = db["admins"].find({})
        async for admin in cursor:
            if admin['role'] == 'super_admin':
                super_admins.append(admin)
            elif admin['role'] == 'hr_admin':
                hr_admins.append(admin)
            elif admin['role'] == 'admin':
                content_admins.append(admin)
        
        print(f"\n🔴 SUPER ADMINS ({len(super_admins)} users)")
        print("   Sidebar Access: Dashboard + Articles + Blogs + Knowledge + Contacts + Alumni")
        print("   Password: superadmin123")
        for admin in super_admins:
            print(f"   📧 {admin['email']} ({admin['name']})")
        
        print(f"\n🟢 CONTENT ADMINS ({len(content_admins)} users)")
        print("   Sidebar Access: Dashboard + Articles + Blogs + Knowledge ONLY")
        print("   Hidden: Contacts, Alumni buttons")
        print("   Password: admin123")
        for admin in content_admins:
            print(f"   📧 {admin['email']} ({admin['name']})")
        
        print(f"\n🟡 HR ADMINS ({len(hr_admins)} users)")
        print("   Sidebar Access: Dashboard + Contacts + Alumni ONLY")
        print("   Hidden: Articles, Blogs, Knowledge buttons")
        print("   Password: hradmin123")
        for admin in hr_admins:
            print(f"   📧 {admin['email']} ({admin['name']})")
        
        print(f"\n📊 TOTAL ADMINS: {len(super_admins) + len(content_admins) + len(hr_admins)}")
        
        print(f"\n🧪 TEST INSTRUCTIONS:")
        print("=" * 60)
        print("1. Login as Content Admin (admin1@jhs.com / admin123)")
        print("   → Should see: Dashboard, Articles, Blogs, Knowledge")
        print("   → Should NOT see: Contacts, Alumni")
        print()
        print("2. Login as HR Admin (hradmin1@jhs.com / hradmin123)")
        print("   → Should see: Dashboard, Contacts, Alumni")
        print("   → Should NOT see: Articles, Blogs, Knowledge")
        print()
        print("3. Login as Super Admin (superadmin1@jhs.com / superadmin123)")
        print("   → Should see: ALL sections (Dashboard, Articles, Blogs, Knowledge, Contacts, Alumni)")
        
        print(f"\n🌐 Login URL: http://localhost:5174/login")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error verifying role access: {e}")

if __name__ == "__main__":
    asyncio.run(verify_role_access())