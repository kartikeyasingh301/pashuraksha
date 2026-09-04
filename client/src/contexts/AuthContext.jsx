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
    localStorage.setItem('pasu_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pasu_token');
    localStorage.removeItem('pasu_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('pasu_token');
      const storedUserStr = localStorage.getItem('pasu_user');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // 1. Optimistically load user from local storage so OFFLINE mode works immediately
      if (storedUserStr) {
        try {
          setUser(JSON.parse(storedUserStr));
        } catch (_) {}
      }
      setToken(storedToken);

      // 2. Try to verify with backend if we are online
      try {
        const data = await apiGet('/auth/me');
        setUser(data.user || data);
        localStorage.setItem('pasu_user', JSON.stringify(data.user || data));
      } catch (err) {
        // If we are OFFLINE, `fetch` throws 'Failed to fetch'. 
        // We MUST NOT clear the token here, or the user gets kicked out while offline!
        // Only clear if the server explicitly rejected our token (e.g., 401 Unauthorized)
        if (navigator.onLine && err.message !== 'Failed to fetch') {
          localStorage.removeItem('pasu_token');
          localStorage.removeItem('pasu_user');
          setToken(null);
          setUser(null);
        }
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