import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import WorkspacesPage from './pages/WorkspacesPage';
import ArxivSearchPage from './pages/ArxivSearchPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/workspaces" element={<WorkspacesPage />} />
      <Route path="/arxiv" element={<ArxivSearchPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
