import { useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const BACKEND_HEALTH = `${BASE_URL}/health`;

async function pingBackend() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(BACKEND_HEALTH, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(id);
    return res.ok;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true); // optimistic — fix immediately on first ping

  const check = useCallback(async () => {
    const result = await pingBackend();
    setIsOnline(result);
  }, []);

  useEffect(() => {
    check(); // immediate check on mount

    const interval = setInterval(check, 8000); // re-check every 8s

    window.addEventListener('online', check);
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', check);
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, [check]);

  return { isOnline };
}