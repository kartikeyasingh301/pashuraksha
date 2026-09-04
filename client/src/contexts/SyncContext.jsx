import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { usePendingSync } from '../hooks/usePendingSync.js';
import { syncQueue } from '../sync/syncManager.js';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const { isOnline } = useOnlineStatus();
  const { pendingCount, refresh } = usePendingSync();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const prevOnline = useRef(isOnline);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await syncQueue();
      setLastSyncAt(new Date());
      await refresh();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refresh]);

  useEffect(() => {
    if (isOnline && !prevOnline.current) {
      triggerSync();
    }
    prevOnline.current = isOnline;

    let interval;
    if (isOnline) {
      interval = setInterval(() => {
        if (pendingCount > 0) triggerSync();
      }, 10000); // Retry every 10 seconds if there are pending items
    }
    return () => clearInterval(interval);
  }, [isOnline, pendingCount, triggerSync]);

  return (
    <SyncContext.Provider value={{ pendingCount, isOnline, isSyncing, triggerSync, lastSyncAt, refresh }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncContext must be used within SyncProvider');
  return ctx;
}