import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { getWorkspaces, getChatHistory, sendMessage } from '../services/api';
import { Workspace, ChatMessage } from '../services/api';

export default function ChatPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getWorkspaces().then(setWorkspaces); }, []);
  useEffect(() => {
    if (selectedWs) getChatHistory(selectedWs).then(setMessages);
  }, [selectedWs]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || !selectedWs) return;
    setLoading(true);
    try {
      const reply = await sendMessage(selectedWs, input);
      setMessages(prev => [...prev, { id: Date.now(), workspace_id: selectedWs, role: 'user', content: input, created_at: new Date().toISOString() }, reply]);
      setInput('');
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <h2>Chat</h2>
        <select onChange={e => setSelectedWs(Number(e.target.value))} defaultValue="">
          <option value="" disabled>Select workspace</option>
          {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: 16, marginTop: 8 }}>
          {messages.map(m => (
            <div key={m.id} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
              <span style={{ background: m.role === 'user' ? '#007bff' : '#e9ecef', color: m.role === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: 12, display: 'inline-block' }}>{m.content}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input style={{ flex: 1, padding: 8 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about your papers..." disabled={!selectedWs} />
          <button onClick={send} disabled={loading || !selectedWs}>{loading ? '...' : 'Send'}</button>
        </div>
      </div>
    </Layout>
  );
}
