from pydantic import BaseModel, Field, validator
from datetime import datetime

class Log(BaseModel):
    timestamp: datetime
    message: str
    level: str
    service: str

    @validator('level')
    def validate_level(cls, value):
        if value not in ["INFO", "WARNING", "ERROR", "DEBUG"]:
            raise ValueError("Level must be INFO, WARNING, ERROR, DEBUG")
        return value