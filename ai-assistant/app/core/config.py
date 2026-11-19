"""Central, environment-driven configuration. Nothing tunable is hard-coded elsewhere."""
from functools import lru_cache
from typing import List

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore", populate_by_name=True)

    # ---- app ----
    app_env: str = "development"
    port: int = 8100
    allowed_origins: str = "*"  # comma separated; set to the real site origin(s) in production
    admin_api_key: str = Field("", validation_alias=AliasChoices("ADMIN_API_KEY", "API_KEY"))
    log_level: str = "INFO"

    # ---- OpenAI ----
    openai_api_key: str = ""
    chat_model: str = "gpt-4.1"
    router_model: str = "gpt-4.1-mini"
    rerank_model: str = "gpt-4.1-mini"
    embedding_model: str = "text-embedding-3-large"
    # text-embedding-3-large is 3072-d natively; it supports shortening via `dimensions`. This MUST equal the Pinecone
    # index dimension (checked at startup).
    embedding_dimensions: int = 1024
    openai_timeout_seconds: float = 60.0
    answer_max_tokens: int = 700
    answer_temperature: float = 0.2

    # ---- Pinecone (a separate index from the legacy chatbot's `jhs-website-chatbot`) ----
    pinecone_api_key: str = ""
    ai_pinecone_index: str = "jhs-assistant-vectors"

    # ---- MongoDB ----
    mongo_uri: str = Field("mongodb://localhost:27017", validation_alias=AliasChoices("MONGO_URI", "MONGODB_URL"))
    # Database holding the PUBLIC website content (read through the allowlist only).
    source_db_name: str = Field("JHS_website", validation_alias=AliasChoices("MONGO_DB_NAME", "DATABASE_NAME"))
    # The assistant's own data (conversations, chunk registry, sync log, facts, evaluation).
    app_db_name: str = "JHS_ai_assistant"

    # ---- site ----
    site_base_url: str = "https://jhsassociates.in"
    site_sitemap_url: str = Field("https://jhsassociates.in/sitemap.xml", validation_alias=AliasChoices("SITE_SITEMAP_URL"))
    contact_email: str = "connect@jhsassociates.in"
    contact_page_path: str = "/contact"

    # ---- chunking ----
    chunk_max_tokens: int = 700
    chunk_overlap_tokens: int = 100
    chunk_min_tokens: int = 60

    # ---- retrieval ----
    retrieval_top_k: int = 12          # candidates per retriever
    final_context_chunks: int = 6      # chunks passed to the model
    rrf_k: int = 60
    # Cosine similarity below which a dense hit is not trusted. Needs calibration on the evaluation set.
    min_dense_score: float = 0.30
    rerank_enabled: bool = True
    bm25_refresh_seconds: int = 120

    # ---- conversation ----
    history_window_messages: int = 6
    summarize_after_messages: int = 14
    max_message_chars: int = 1000
    rate_limit_per_minute: int = 15

    @property
    def origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def embedding_version(self) -> str:
        """Changing any of these invalidates stored vectors, so a re-embed is triggered."""
        return f"{self.embedding_model}:{self.embedding_dimensions}:{self.chunk_max_tokens}:{self.chunk_overlap_tokens}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
