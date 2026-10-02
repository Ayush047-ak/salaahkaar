import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Salaahkaar Geospatial Engine"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    PORT: int = 8000
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
    PROCESSED_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/processed"))

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
