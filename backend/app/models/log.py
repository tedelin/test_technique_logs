from pydantic import BaseModel, Field, validator
from datetime import datetime

class Log(BaseModel):
    timestamp: str
    message: str
    level: str
    service: str

    @validator('timestamp')
    def validate_timestamp(cls, value):
        try:
            datetime.fromisoformat(value.replace("Z", "+00:00"))
            return value
        except ValueError:
            raise ValueError("Timestamp must be a valid ISO 8601 datetime string")

    @validator('level')
    def validate_level(cls, value):
        if value not in ["INFO", "WARNING", "ERROR", "DEBUG"]:
            raise ValueError("Level must be INFO, WARNING, ERROR, DEBUG")
        return value