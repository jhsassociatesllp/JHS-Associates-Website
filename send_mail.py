import requests

API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYTQ0MGFlYmNkZjUyZGJmMzZiMjg2NDZkN2JhNzcwOTJjOWJjNDM1MjE4MDEyZjNiNzM5ODEzNmM2YjU1ZjgwZDY0MmVhZDc3N2ZhYWFkNmQiLCJpYXQiOjE3ODU1MDM2NjIuMzI2MDg4LCJuYmYiOjE3ODU1MDM2NjIuMzI2MDksImV4cCI6NDk0MTE3NzI2Mi4zMjE0ODMsInN1YiI6IjIwNzY1MDMiLCJzY29wZXMiOltdfQ.uXfnH8S3mryzCUJ-m9g-HF5RElpccwJw0j_1CqLeu7rlQMJ5TmUC3Kf0gittCt6mTtjr5nXctvwA_x1vrS4jHww2v9W2X-KBhRgDbnRz0zbVy_gpLBLu9HRFCEA2W1kVEtvrtAXbpzhg-wC4oVxrj74IXYvdnsmIuQah2Q_fh2R3Ma5o-tmEDdPK3YvmKpqO3cH8CVg_x0WaaFV0rZn45foTHk4p007hBtiFpGxMGXRwM5X9codlbhvigZq86cvvGleUcR3FLfMzymH3xEXVTbv3HU1GqFvxKlK6ciMIwwIYB5XVz1AyaRzDuZcmWa01AOFozzNzmmr-eomwIHDZtc0GBgoii-yh3--iAE7vwTuEli8ZJDwicuNUCgGPTGsUWUCJ1p1a-eufQuKh2lp9GDutkDfVddzRChLVkK_6MXKibrxw-ctHvPjJKbScBpDhfLNWUMzFZMFrlvpyFRt8QtQ-RdSBcKQ0pkBKWWKVnVxOqxzulmxSAXTdtmoWvPpXZ_q4FRVPApZO31lWNBb_UV3awCJpKc_9vCVtIxsOjaWT8t60Kqsa9y6AC8wkozSh3T2DkBV7ObvklZEiU0GEaFTIUyNdotEy5jBHarkv6rEwZhcfNmfB7DEL1Ax-UW8zmjj9ph0RWvM_bby1xmtR7URnsGY1_UF9rfUnY0_V-YY"

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