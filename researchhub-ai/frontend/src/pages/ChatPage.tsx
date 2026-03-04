import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';

interface Paper {
  id: number;
  title: string;
}

export const ChatPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Paper[]>('/papers')
      .then((res) => setPapers(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load papers');
      });
  }, []);

  const togglePaper = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAnswer(null);
    setLoading(true);
    try {
      const res = await api.post<{ answer: string }>('/chatbot/ask', {
        question,
        paper_ids: selectedIds.length ? selectedIds : undefined
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setError('Agent failed to answer. Check backend logs / Groq key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold mb-1">Agentic query</h2>
          <p className="text-xs text-slate-400 mb-4">
            Ask questions grounded in your stored research papers.
          </p>
          <form onSubmit={handleAsk} className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Question</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Grounding papers</label>
              <p className="text-[10px] text-slate-500 mb-2">
                Select specific papers or leave all unselected to use a recent subset.
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {papers.map((paper) => (
                  <label
                    key={paper.id}
                    className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(paper.id)}
                      onChange={() => togglePaper(paper.id)}
                      className="h-3 w-3 rounded border-slate-700 bg-slate-900"
                    />
                    <span className="truncate">{paper.title}</span>
                  </label>
                ))}
                {!papers.length && (
                  <p className="text-[11px] text-slate-500">
                    Add papers on the dashboard to enable grounded chat.
                  </p>
                )}
              </div>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-xs font-medium hover:bg-primary-500 disabled:opacity-60"
            >
              {loading ? 'Asking agent…' : 'Ask agent'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold mb-2">Agent response</h2>
          <div className="h-[360px] rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs overflow-y-auto">
            {answer ? (
              <pre className="whitespace-pre-wrap text-slate-100">{answer}</pre>
            ) : (
              <p className="text-slate-500 text-xs">
                The agent&apos;s grounded answer will appear here.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

