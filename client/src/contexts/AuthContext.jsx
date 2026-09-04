import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pasu_token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const login = useCallback(async (username, password) => {
    const data = await apiPost('/auth/login', { username, password });
    localStorage.setItem('pasu_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pasu_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('pasu_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiGet('/auth/me');
        setUser(data.user || data);
        setToken(storedToken);
      } catch (_) {
        localStorage.removeItem('pasu_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}