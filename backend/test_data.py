import asyncio
import requests
from datetime import datetime, timezone

API_BASE = "http://localhost:8000"

# Sample contact data
sample_contacts = [
    {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "phone": "+1-555-0123",
        "company": "Tech Solutions Inc",
        "service": "Tax Consultation",
        "message": "I need help with corporate tax planning for the upcoming fiscal year. Our company has grown significantly and we want to ensure we're optimizing our tax strategy."
    },
    {
        "name": "Sarah Johnson",
        "email": "sarah.j@businesscorp.com",
        "phone": "+1-555-0456",
        "company": "Business Corp",
        "service": "Audit Services",
        "message": "We require audit services for our annual financial statements. Please let me know your availability and pricing."
    },
    {
        "name": "Michael Chen",
        "email": "m.chen@startup.io",
        "company": "StartupIO",
        "service": "Business Advisory",
        "message": "Looking for business advisory services for our tech startup. We need guidance on financial planning and compliance."
    }
]

# Sample alumni data
sample_alumni = [
    {
        "first_name": "Emily",
        "last_name": "Davis",
        "email": "emily.davis@finance.com",
        "phone": "+1-555-0789",
        "company": "Global Finance Ltd",
        "designation": "Senior Financial Analyst",
        "tenure": "2018-2022",
        "last_role": "Junior Accountant",
        "message": "Great experience working at JHS Associates. The training and mentorship I received helped me advance my career significantly."
    },
    {
        "first_name": "Robert",
        "last_name": "Wilson",
        "email": "r.wilson@consulting.com",
        "phone": "+1-555-0321",
        "company": "Wilson Consulting",
        "designation": "Managing Partner",
        "tenure": "2015-2020",
        "last_role": "Senior Tax Consultant",
        "message": "JHS Associates provided an excellent foundation for my career. I learned valuable skills that I still use today in my own practice."
    },
    {
        "first_name": "Lisa",
        "last_name": "Anderson",
        "email": "lisa.anderson@corp.com",
        "company": "Anderson & Associates",
        "designation": "CPA",
        "tenure": "2019-2023",
        "last_role": "Staff Accountant"
    }
]

async def create_test_data():
    print("Creating test contact submissions...")
    
    # Create contacts
    for contact in sample_contacts:
        try:
            response = requests.post(f"{API_BASE}/contact/", json=contact)
            if response.status_code == 201:
                print(f"✅ Created contact: {contact['name']}")
            else:
                print(f"❌ Failed to create contact: {contact['name']} - {response.text}")
        except Exception as e:
            print(f"❌ Error creating contact {contact['name']}: {e}")
    
    print("\nCreating test alumni registrations...")
    
    # Create alumni
    for alumni in sample_alumni:
        try:
            response = requests.post(f"{API_BASE}/alumni/", json=alumni)
            if response.status_code == 201:
                print(f"✅ Created alumni: {alumni['first_name']} {alumni['last_name']}")
            else:
                print(f"❌ Failed to create alumni: {alumni['first_name']} {alumni['last_name']} - {response.text}")
        except Exception as e:
            print(f"❌ Error creating alumni {alumni['first_name']} {alumni['last_name']}: {e}")
    
    print("\n🎉 Test data creation completed!")

if __name__ == "__main__":
    asyncio.run(create_test_data())