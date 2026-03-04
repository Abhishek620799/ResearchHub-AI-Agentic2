from typing import List

from groq import Groq

from app.core.config import get_settings


settings = get_settings()


def get_groq_client() -> Groq:
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return Groq(api_key=settings.GROQ_API_KEY)


def generate_answer(question: str, context_chunks: List[str]) -> str:
    client = get_groq_client()
    system_prompt = (
        "You are an AI research assistant working in a research paper management "
        "system called ResearchHub AI. Use the provided context (excerpts from "
        "stored research papers) to answer the question concisely and accurately. "
        "If the context is insufficient, say so explicitly."
    )

    context_text = "\n\n---\n\n".join(context_chunks) if context_chunks else "No context."

    messages = [
        {
            "role": "system",
            "content": system_prompt,
        },
        {
            "role": "user",
            "content": f"Context:\n{context_text}\n\nQuestion: {question}",
        },
    ]

    completion = client.chat.completions.create(
        model=settings.GROQ_MODEL_NAME,
        messages=messages,
        temperature=0.2,
        max_tokens=1024,
    )

    return completion.choices[0].message.content.strip()

