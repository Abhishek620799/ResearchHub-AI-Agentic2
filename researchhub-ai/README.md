## ResearchHub AI – Agentic Research Paper Management System

Full-stack production-ready template for an AI-assisted research paper management system.

### Tech stack

- **Backend**: FastAPI, PostgreSQL, SQLAlchemy 2.0, JWT auth, Groq (Llama 3.3 70B), Sentence Transformers
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Axios, React Router DOM, Context API

### Backend setup

1. **Install dependencies**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. **Configure environment**

- Copy `.env.example` to `.env` and fill in values (PostgreSQL credentials, `JWT_SECRET_KEY`, `GROQ_API_KEY`, etc.).
- Ensure PostgreSQL database (`researchhub_ai` by default) exists and is reachable.

3. **Run backend**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`, with main routes under `/api`.

### Frontend setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment**

- Copy `.env.example` to `.env`.
- Adjust `VITE_API_URL` if your backend is not at `http://localhost:8000/api`.

3. **Run frontend**

```bash
npm run dev
```

Vite will start on `http://localhost:5173`.

### Core features

- **JWT authentication**: Email/password registration and login with secure password hashing.
- **Paper management**:
  - Create, list, update, and delete research papers.
  - Store metadata (title, authors, tags, abstract) and full text/notes.
  - Sentence Transformer embeddings for vector search.
- **Semantic search**:
  - `/api/papers/search` endpoint to retrieve most relevant papers via cosine similarity.
- **Agentic chatbot**:
  - `/api/chatbot/ask` endpoint that:
    - Pulls recent or selected user papers.
    - Sends contextualized prompt to Groq (Llama 3.3 70B).
    - Returns grounded answer to frontend chat UI.

### Security & production notes

- Change `JWT_SECRET_KEY` in `.env` before deploying.
- Restrict `FRONTEND_ORIGIN` to your actual frontend URL in production.
- Use HTTPS and secure cookie / header settings when putting behind a proxy (e.g., Nginx).
- Consider moving embeddings into a dedicated vector store (e.g., pgvector, Qdrant) for large-scale deployments.

