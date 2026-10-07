import os
import requests

API_KEY = os.environ["MAILERLITE_API_KEY"]  # set in your environment, never commit it

url = "https://connect.mailerlite.com/api/email"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "from": {
        "email": "connect@jhsassociates.in",
        "name": "JHS Associates"
    },
    "to": [
        {
            "email": "vasu.gadde@jhsassociates.in",
            "name": "Vasu Gadde"
        }
    ],
    "subject": "Test Email from Python",
    "text": "Hello Vasu,\n\nThis is a test email sent using the MailerLite API and Python.",
    "html": """
        <h2>Hello Vasu,</h2>
        <p>This is a <strong>test email</strong> sent using the MailerLite API and Python.</p>
    """
}

response = requests.post(url, headers=headers, json=payload)

print("Status Code:", response.status_code)
print(response.text)