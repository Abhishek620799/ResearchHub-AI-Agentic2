# ResearchHub AI — Agentic Research Paper Management System

> An intelligent, full-stack AI-powered platform for discovering, organizing, and analyzing research papers using Agentic AI.

## Overview

ResearchHub AI enables researchers to search academic databases, import papers into personal workspaces, and interact with an AI chatbot (powered by Groq's Llama 3.3 70B) that provides contextual insights, summaries, and answers based on research content.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | FastAPI, PostgreSQL, SQLAlchemy 2.0, JWT Auth, Groq (Llama 3.3 70B), Sentence Transformers |
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Axios, React Router DOM, Context API |

## Project Structure

```
ResearchHub-AI-Agentic2/
└── researchhub-ai/
    ├── backend/          # FastAPI backend
    │   ├── app/
    │   │   ├── core/     # Config & security
    │   │   ├── models/   # SQLAlchemy models
    │   │   ├── routers/  # API route handlers (auth, papers, chatbot)
    │   │   ├── schemas/  # Pydantic schemas
    │   │   ├── services/ # Groq & embedding services
    │   │   ├── database.py
    │   │   └── main.py
    │   ├── .env.example
    │   └── requirements.txt
    └── frontend/         # React + TypeScript frontend
        ├── src/
        │   ├── components/
        │   ├── context/
        │   ├── pages/
        │   └── services/
        ├── .env.example
        └── package.json
```

## Quick Start

See [`researchhub-ai/README.md`](./researchhub-ai/README.md) for full setup instructions including:
- Backend environment setup (PostgreSQL, Groq API key, JWT secret)
- Frontend setup (Vite + TailwindCSS)
- Running both servers locally

## Key Features

- **JWT Authentication** — Secure email/password registration and login
- **Paper Management** — Create, list, update, delete research papers with metadata
- **Semantic Search** — Vector embeddings (Sentence Transformers) for similarity search
- **Agentic Chatbot** — Groq Llama 3.3 70B answering questions grounded in your paper workspace
- **Multi-Workspace** — Separate paper collections per project

## Team

| Name | Role |
|------|------|
| Abhishek Kumar | Team Lead |
| Chetan Galphat | Member |
| Bhavin Suryavanshi | Member |
| Prashant Dwivedi | Member |
| Aditya Singh | Member |

## License

For educational purposes — Agentic AI Application Developer program with IBM.
