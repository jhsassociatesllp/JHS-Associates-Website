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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()