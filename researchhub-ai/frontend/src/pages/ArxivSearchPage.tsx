import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { searchArxiv, createPaper, getWorkspaces, ArxivPaper, Workspace } from '../services/api';

export const ArxivSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArxivPaper[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState<number | ''>('');
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    getWorkspaces().then(r => setWorkspaces(r.data)).catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true); setError(null); setResults([]);
    try {
      const res = await searchArxiv(query.trim(), 15);
      setResults(res.data);
    } catch { setError('Search failed. Try again.'); }
    finally { setSearching(false); }
  };

  const handleImport = async (paper: ArxivPaper) => {
    setImporting(paper.arxiv_id);
    try {
      await createPaper({
        title: paper.title,
        abstract: paper.abstract,
        authors: paper.authors,
        tags: `arxiv:${paper.arxiv_id}`,
        content: `Published: ${paper.published}\nURL: ${paper.url}`,
        workspace_id: selectedWs ? Number(selectedWs) : undefined,
      });
      setImported(prev => new Set(prev).add(paper.arxiv_id));
    } catch { alert('Import failed'); }
    finally { setImporting(null); }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">arXiv Paper Search</h1>
        <p className="text-slate-400 mb-6">Search academic papers from arXiv and import them into your workspace.</p>
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="e.g. transformer attention mechanism"
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-400"
            required />
          <button type="submit" disabled={searching}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-2.5 font-medium disabled:opacity-50">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm text-slate-400">Import to workspace:</label>
          <select value={selectedWs} onChange={e => setSelectedWs(e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-100 text-sm">
            <option value="">Default (no workspace)</option>
            {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="space-y-4">
          {results.map(paper => (
            <div key={paper.arxiv_id} className="bg-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <a href={paper.url} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-primary-400 hover:underline line-clamp-2">{paper.title}</a>
                  <p className="text-xs text-slate-400 mt-1">{paper.authors} &bull; {paper.published}</p>
                  <p className="text-sm text-slate-300 mt-2 line-clamp-3">{paper.abstract}</p>
                </div>
                <button onClick={() => handleImport(paper)}
                  disabled={importing === paper.arxiv_id || imported.has(paper.arxiv_id)}
                  className="shrink-0 text-sm rounded-lg px-4 py-2 font-medium disabled:opacity-50 bg-emerald-700 hover:bg-emerald-600 text-white">
                  {imported.has(paper.arxiv_id) ? 'Imported ✓' : importing === paper.arxiv_id ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          ))}
          {!searching && results.length === 0 && query && <p className="text-slate-400">No results found.</p>}
        </div>
      </div>
    </Layout>
  );
};
