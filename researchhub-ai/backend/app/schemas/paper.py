from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class PaperBase(BaseModel):
    title: str
    abstract: Optional[str] = None
    authors: Optional[str] = None
    tags: Optional[str] = None
    content: Optional[str] = None


class PaperCreate(PaperBase):
    pass


class PaperUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    authors: Optional[str] = None
    tags: Optional[str] = None
    content: Optional[str] = None


class PaperRead(PaperBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaperSearchQuery(BaseModel):
    query: str
    top_k: int = 5


class ChatRequest(BaseModel):
    question: str
    paper_ids: Optional[List[int]] = None


class ChatResponse(BaseModel):
    answer: str

