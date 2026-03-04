import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';

interface Paper {
  id: number;
  title: string;
  abstract?: string | null;
  authors?: string | null;
  tags?: string | null;
  created_at: string;
}

export const DashboardPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const fetchPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Paper[]>('/papers');
      setPapers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPapers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/papers', {
        title,
        abstract,
        authors,
        tags,
        content
      });
      setTitle('');
      setAbstract('');
      setAuthors('');
      setTags('');
      setContent('');
      void fetchPapers();
    } catch (err) {
      console.error(err);
      setError('Failed to create paper');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/papers/${id}`);
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete paper');
    }
  };

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold mb-1">Add research paper</h2>
          <p className="text-xs text-slate-400 mb-4">
            Capture metadata and content; embeddings are generated automatically.
          </p>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Title</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Abstract</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1">Authors</label>
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Tags</label>
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="LLMs, RAG, Agents"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1">Full text / notes</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-xs font-medium hover:bg-primary-500"
            >
              Save paper
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold">Your library</h2>
              <p className="text-xs text-slate-400">
                {loading ? 'Loading papers…' : `${papers.length} papers indexed`}
              </p>
            </div>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {papers.map((paper) => (
              <article
                key={paper.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-slate-50 mb-1">{paper.title}</h3>
                    {paper.authors && (
                      <p className="text-[10px] text-slate-400 mb-1">{paper.authors}</p>
                    )}
                    {paper.abstract && (
                      <p className="text-[11px] text-slate-300 line-clamp-3">
                        {paper.abstract}
                      </p>
                    )}
                    {paper.tags && (
                      <p className="mt-1 text-[10px] text-primary-300">{paper.tags}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="rounded-md border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {!loading && papers.length === 0 && (
              <p className="text-xs text-slate-500">No papers yet. Add your first one on the left.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

