from os import getenv

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    HEALTH_CHECK_PATH: str = "/healthcheck"

    # LOG LEVEL
    LOG_LEVEL_INFO: str = "APP_INFO"
    LOG_LEVEL_ERROR: str = "APP_ERROR"

    # LLM info
    LLM_API_KEY: str = getenv("LLM_API_KEY", default="")
    LLM_API_BASE: str = getenv("LLM_API_BASE", default="")
    LLM_API_VERSION: str = getenv("LLM_API_VERSION", default="")
    LLM_DEPLOYMENT_NAME: str = getenv("LLM_DEPLOYMENT_NAME", default="")

    class Config:
        case_sensitive = True


settings = Settings()
