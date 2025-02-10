from typing import Literal

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Second Brain"
    API_STR: str = "/api"
    BACKEND_CORS_ORIGINS: list = ["*"]
    APP_ENV: Literal["dev", "staging", "prod"] = "dev"



    # embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    RERANKER_MODEL: str = "Alibaba-NLP/gte-multilingual-reranker-base"
    DOCUMENT_BATCH_SIZE: int = 512


    # CHROMA DB
    CHROMADB_HOST: str = "0.0.0.0"
    CHROMADB_PORT: int = 8000
    CHROMADB_DEFAULT_DATABASE: str = "memoryai"
    CHROMADB_DEFAULT_TENANT: str = "ashish:1234"

    # API KEYS
    API_KEY_BYTES: int = 32
    API_KEY: str = "sk_119d7589ee1733d1e1dc0ed7888e6573a6adb4f7d6b719a692791870bc25311a"
    DB_ID: str = "66a377e8a629929b6b7aae7d"
    WRONG_THRESHOLD: int = 4
    EXCELLENT_THRESHOLD: int = 8

    # CHAT MEMORY
    CONVERSATION_LIMIT: int = 30


    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()