from datetime import datetime
from typing import List, Optional

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(512), nullable=False, index=True)
    abstract = Column(Text, nullable=True)
    authors = Column(String(512), nullable=True)
    tags = Column(String(512), nullable=True)
    content = Column(Text, nullable=True)
    embedding = Column(JSON, nullable=True)  # stores List[float]
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", backref="papers")
    workspace = relationship("Workspace", back_populates="papers")
