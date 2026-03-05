import React from 'react';
import { Link } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{ background: '#1a1a2e', padding: '12px 24px', display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ color: '#e94560', fontWeight: 'bold', fontSize: 18 }}>ResearchHub AI</span>
        <Link style={{ color: 'white', textDecoration: 'none' }} to='/'>Dashboard</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to='/workspaces'>Workspaces</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to='/arxiv'>ArXiv Search</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to='/chat'>Chat</Link>
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
