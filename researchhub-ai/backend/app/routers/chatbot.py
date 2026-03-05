from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database import get_db
from app.models.paper import Paper
from app.models.user import User
from app.models.workspace import Workspace
from app.models.chat_history import ChatHistory
from app.services.groq_service import generate_answer
from app.schemas.chat_history import ChatHistoryRead

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

class AskRequest(BaseModel):
    question: str
    workspace_id: int = None

@router.post("/ask")
def ask(payload: AskRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Paper).filter(Paper.owner_id == current_user.id)
    if payload.workspace_id:
        ws = db.get(Workspace, payload.workspace_id)
        if not ws or ws.owner_id != current_user.id:
            raise HTTPException(status_code=404, detail="Workspace not found")
        query = query.filter(Paper.workspace_id == payload.workspace_id)
    papers = query.all()
    context = "\n\n".join([f"Title: {p.title}\nAbstract: {p.abstract or p.content or ''}" for p in papers])
    answer = generate_answer(payload.question, context)
    if payload.workspace_id:
        db.add(ChatHistory(workspace_id=payload.workspace_id, role="user", content=payload.question))
        db.add(ChatHistory(workspace_id=payload.workspace_id, role="assistant", content=answer))
        db.commit()
    return {"answer": answer}

@router.get("/history/{workspace_id}", response_model=List[ChatHistoryRead])
def get_history(workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ws = db.get(Workspace, workspace_id)
    if not ws or ws.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return db.query(ChatHistory).filter(ChatHistory.workspace_id == workspace_id).order_by(ChatHistory.created_at).all()
