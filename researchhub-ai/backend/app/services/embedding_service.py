from functools import lru_cache
from typing import Iterable, List

import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import get_settings


settings = get_settings()


@lru_cache
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(settings.EMBEDDING_MODEL_NAME)


def embed_text(text: str) -> List[float]:
    model = get_embedding_model()
    emb = model.encode(text)
    return emb.astype(float).tolist()


def embed_texts(texts: Iterable[str]) -> List[List[float]]:
    model = get_embedding_model()
    embs = model.encode(list(texts))
    return [e.astype(float).tolist() for e in embs]


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    if a.size == 0 or b.size == 0:
        return 0.0
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

