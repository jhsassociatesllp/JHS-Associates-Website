# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     mongodb_url: str
#     database_name: str = "JHS_website"

#     class Config:  
#         env_file = ".env"

# settings = Settings()

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "JHS_website"

    # Brevo (Sendinblue) email configuration
    brevo_api_key: str = ""
    hr_notification_email: str = "hr@jhsassociates.in"
    sender_email: str = "vasu.gadde@jhsassociates.in"
    sender_name: str = "JHS Associates"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()