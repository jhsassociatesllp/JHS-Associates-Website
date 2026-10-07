# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     mongodb_url: str
#     database_name: str = "JHS_website"

#     class Config:  
#         env_file = ".env"

# settings = Settings()

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Anchored to this file's location (backend/app/config/settings.py -> backend/)
# rather than left relative, so .env still loads correctly no matter what
# working directory the server is launched from (a relative path here only
# resolves when the process happens to be started from inside backend/).
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017/"
    database_name: str = "JHS_website"

    # Brevo (Sendinblue) email configuration — kept for rollback only, no
    # longer used by email_service.py (see smtp_* below, which is active).
    brevo_api_key: str = ""
    hr_notification_email: str = "hr@jhsassociates.in"
    # Appointment / consultation bookings (Book Appointment page and the partner
    # cards' Book Appointment button) are routed here instead of the HR inbox.
    appointment_notification_email: str = "connect@jhsassociates.in"
    sender_email: str = "maaz.quraishi@jhsassociates.in"
    sender_name: str = "JHS"

    # Outlook / Microsoft 365 SMTP configuration.
    # smtp_username/smtp_password are the mailbox credentials that send the
    # mail (an App Password if MFA is on). sender_email should normally
    # match smtp_username unless a send-as alias is configured on that
    # mailbox — Microsoft may otherwise reject or rewrite the From address.
    smtp_host: str = "smtp.office365.com"
    smtp_port: int = 587
    smtp_username: str = "maaz.quraishi@jhsassociates.in"
    smtp_password: str = ""

    # Signs admin / user JWTs and hashes visitor IPs. REQUIRED in every
    # environment (generate with: python -c "import secrets;print(secrets.token_urlsafe(64))").
    secret_key: str = ""

    # Google Sign-In (career applicants + consulting appointment requests).
    # Create an OAuth 2.0 Client ID (Web application) in Google Cloud Console
    # and add this site's origin under "Authorized JavaScript origins".
    google_client_id: str = ""

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()