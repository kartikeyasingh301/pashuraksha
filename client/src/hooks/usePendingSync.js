import { useState, useEffect, useCallback } from 'react';
import { getPendingCount } from '../sync/syncManager.js';

export function usePendingSync() {
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { pendingCount, refresh };
}