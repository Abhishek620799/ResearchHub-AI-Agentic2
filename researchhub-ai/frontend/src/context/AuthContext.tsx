import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  full_name?: string | null;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rh_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api
        .get<User>('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('rh_token');
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    form.append('grant_type', '');
    form.append('scope', '');
    form.append('client_id', '');
    form.append('client_secret', '');

    const res = await api.post<{ access_token: string }>('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const accessToken = res.data.access_token;
    setToken(accessToken);
    localStorage.setItem('rh_token', accessToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const me = await api.get<User>('/auth/me');
    setUser(me.data);
    navigate('/');
  };

  const register = async (email: string, password: string, fullName?: string) => {
    await api.post('/auth/register', { email, password, full_name: fullName });
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rh_token');
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

