import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-sm font-bold">
              RH
            </span>
            <div>
              <div className="font-semibold">ResearchHub AI</div>
              <div className="text-xs text-slate-400">Agentic Research Paper Management</div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user && (
              <>
                <Link to="/" className="hover:text-primary-400">
                  Dashboard
                </Link>
                <Link to="/chat" className="hover:text-primary-400">
                  Agentic Chat
                </Link>
                <button
                  onClick={logout}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

