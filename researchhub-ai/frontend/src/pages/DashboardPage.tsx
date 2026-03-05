import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { getWorkspaces, getPapers } from '../services/api';
import { Workspace, Paper } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedWs, setSelectedWs] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => { getWorkspaces().then(data => { setWorkspaces(data); if (data.length > 0) setSelectedWs(data[0].id); }); }, []);
  useEffect(() => { if (selectedWs) getPapers(selectedWs).then(setPapers); }, [selectedWs]);

  return (
    <Layout>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <select onChange={e => setSelectedWs(Number(e.target.value))} value={selectedWs || ''}>
          {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <button onClick={() => navigate('/workspaces')}>Manage Workspaces</button>
        <button onClick={() => navigate('/arxiv')}>Search ArXiv Papers</button>
        <button onClick={() => navigate('/chat')}>Open Chat</button>
      </div>
      <h3>Papers in Workspace ({papers.length})</h3>
      <ul>
        {papers.map(p => (
          <li key={p.id} style={{ marginBottom: 12 }}>
            <strong>{p.title}</strong><br />
            <small>{p.authors} — {p.year}</small><br />
            <span>{p.abstract?.slice(0, 200)}...</span>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
