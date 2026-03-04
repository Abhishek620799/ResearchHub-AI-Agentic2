from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models.paper import Paper
from app.models.user import User
from app.schemas.paper import ChatRequest, ChatResponse
from app.services.groq_service import generate_answer


router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/ask", response_model=ChatResponse)
def ask_chatbot(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Paper)
        .filter(Paper.owner_id == current_user.id)
        .order_by(Paper.created_at.desc())
    )

    if payload.paper_ids:
        query = query.filter(Paper.id.in_(payload.paper_ids))

    papers: List[Paper] = query.limit(10).all()

    if not papers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No papers available to ground the chatbot.",
        )

    context_chunks: List[str] = []
    for p in papers:
        chunk = f"Title: {p.title}\nAuthors: {p.authors}\nAbstract: {p.abstract}\nContent: {p.content[:1000] if p.content else ''}"
        context_chunks.append(chunk)

    answer = generate_answer(payload.question, context_chunks)
    return ChatResponse(answer=answer)

