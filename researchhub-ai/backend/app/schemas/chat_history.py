from pydantic import BaseModel
from datetime import datetime

class ChatHistoryRead(BaseModel):
    id: int
    workspace_id: int
    role: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True
