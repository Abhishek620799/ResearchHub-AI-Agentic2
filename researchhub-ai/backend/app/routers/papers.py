from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models.paper import Paper
from app.models.user import User
from app.schemas.paper import (
    PaperCreate,
    PaperRead,
    PaperSearchQuery,
    PaperUpdate,
)
from app.services.embedding_service import (
    cosine_similarity,
    embed_text,
)


router = APIRouter(prefix="/papers", tags=["papers"])


@router.post("/", response_model=PaperRead, status_code=status.HTTP_201_CREATED)
def create_paper(
    paper_in: PaperCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    text_for_embedding = paper_in.abstract or paper_in.content or paper_in.title
    embedding = embed_text(text_for_embedding) if text_for_embedding else None
    paper = Paper(
        title=paper_in.title,
        abstract=paper_in.abstract,
        authors=paper_in.authors,
        tags=paper_in.tags,
        content=paper_in.content,
        embedding=embedding,
        owner_id=current_user.id,
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper


@router.get("/", response_model=List[PaperRead])
def list_papers(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Paper)
        .filter(Paper.owner_id == current_user.id)
        .order_by(Paper.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(query)


@router.get("/{paper_id}", response_model=PaperRead)
def get_paper(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.get(Paper, paper_id)
    if not paper or paper.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found")
    return paper


@router.put("/{paper_id}", response_model=PaperRead)
def update_paper(
    paper_id: int,
    paper_in: PaperUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.get(Paper, paper_id)
    if not paper or paper.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found")

    for field, value in paper_in.dict(exclude_unset=True).items():
        setattr(paper, field, value)

    if any(
        f in paper_in.dict(exclude_unset=True)
        for f in ("title", "abstract", "content")
    ):
        text_for_embedding = paper.abstract or paper.content or paper.title
        paper.embedding = embed_text(text_for_embedding) if text_for_embedding else None

    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper


@router.delete("/{paper_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paper(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.get(Paper, paper_id)
    if not paper or paper.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found")
    db.delete(paper)
    db.commit()
    return None


@router.post("/search", response_model=List[PaperRead])
def search_papers(
    payload: PaperSearchQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_embedding = embed_text(payload.query)

    papers = (
        db.query(Paper)
        .filter(Paper.owner_id == current_user.id, Paper.embedding.isnot(None))
        .all()
    )

    scored = []
    for p in papers:
        if not p.embedding:
            continue
        score = cosine_similarity(query_embedding, p.embedding)
        scored.append((score, p))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_papers = [p for _, p in scored[: payload.top_k]]
    return top_papers

