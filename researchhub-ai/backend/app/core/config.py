from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ResearchHub AI"
    API_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./researchhub.db"
    SECRET_KEY: str = "supersecretkey123changeme"
    JWT_SECRET_KEY: str = "supersecretkey123changeme"
    ALGORITHM: str = "HS256"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GROQ_API_KEY: str = ""
    GROQ_MODEL_NAME: str = "llama-3.3-70b-versatile"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "*"]

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return self.DATABASE_URL

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
