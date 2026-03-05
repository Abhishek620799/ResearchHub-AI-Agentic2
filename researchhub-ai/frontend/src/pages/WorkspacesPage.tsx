import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getWorkspaces, createWorkspace, deleteWorkspace, Workspace } from '../services/api';

export const WorkspacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWS = async () => {
    try { setWorkspaces((await getWorkspaces()).data); } catch { setError('Failed to load workspaces'); }
  };

  useEffect(() => { fetchWS(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createWorkspace(name.trim(), desc.trim() || undefined);
      setName(''); setDesc('');
      await fetchWS();
    } catch { setError('Failed to create workspace'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this workspace and all its papers?')) return;
    try { await deleteWorkspace(id); await fetchWS(); } catch { setError('Failed to delete'); }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">My Workspaces</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleCreate} className="bg-slate-800 rounded-xl p-5 mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">Create New Workspace</h2>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Workspace name (e.g. Deep Learning Research)"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-400"
            required />
          <input value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-400" />
          <button type="submit" disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-2 font-medium disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Workspace'}
          </button>
        </form>
        <div className="space-y-3">
          {workspaces.length === 0 && <p className="text-slate-400">No workspaces yet. Create your first one above.</p>}
          {workspaces.map(ws => (
            <div key={ws.id} className="bg-slate-800 rounded-xl p-5 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-100">{ws.name}</h3>
                {ws.description && <p className="text-sm text-slate-400 mt-1">{ws.description}</p>}
                <p className="text-xs text-slate-500 mt-2">Created {new Date(ws.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Link to={`/chat?ws=${ws.id}`}
                  className="text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-1.5">
                  Chat
                </Link>
                <Link to={`/?ws=${ws.id}`}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg px-3 py-1.5">
                  Papers
                </Link>
                <button onClick={() => handleDelete(ws.id)}
                  className="text-sm bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg px-3 py-1.5">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
