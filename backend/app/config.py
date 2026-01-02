from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Oracle Database
    oracle_user: str = "ADMIN"
    oracle_password: str = ""
    oracle_dsn: str = ""
    oracle_wallet_dir: str | None = None

    # Authentication
    edit_password: str = ""

    # CORS
    frontend_url: str = "http://localhost:3000"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
