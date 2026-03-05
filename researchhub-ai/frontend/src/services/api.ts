import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({ baseURL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Paper {
  id: number;
  title: string;
  abstract?: string | null;
  authors?: string | null;
  tags?: string | null;
  content?: string | null;
  workspace_id?: number | null;
  created_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  description?: string | null;
  owner_id: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  workspace_id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface ArxivPaper {
  arxiv_id: string;
  title: string;
  abstract: string;
  authors: string;
  published: string;
  url: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  api.post<{ access_token: string }>('/auth/token', new URLSearchParams({ username: email, password }));

export const register = (email: string, password: string, full_name: string) =>
  api.post('/auth/register', { email, password, full_name });

// ─── Papers ──────────────────────────────────────────────────────────────────
export const getPapers = (workspace_id?: number) =>
  api.get<Paper[]>('/papers', { params: workspace_id ? { workspace_id } : {} });

export const createPaper = (data: Partial<Paper>) =>
  api.post<Paper>('/papers', data);

export const deletePaper = (id: number) =>
  api.delete(`/papers/${id}`);

export const searchPapers = (query: string, top_k = 5) =>
  api.post<Paper[]>('/papers/search', { query, top_k });

// ─── Workspaces ──────────────────────────────────────────────────────────────
export const getWorkspaces = () =>
  api.get<Workspace[]>('/workspaces');

export const createWorkspace = (name: string, description?: string) =>
  api.post<Workspace>('/workspaces', { name, description });

export const deleteWorkspace = (id: number) =>
  api.delete(`/workspaces/${id}`);

// ─── Chatbot ─────────────────────────────────────────────────────────────────
export const askChatbot = (question: string, workspace_id?: number) =>
  api.post<{ answer: string }>('/chatbot/ask', { question, workspace_id });

export const getChatHistory = (workspace_id: number) =>
  api.get<ChatMessage[]>(`/chatbot/history/${workspace_id}`);

// ─── arXiv Search ────────────────────────────────────────────────────────────
export const searchArxiv = (q: string, max_results = 10) =>
  api.get<ArxivPaper[]>('/arxiv/search', { params: { q, max_results } });
