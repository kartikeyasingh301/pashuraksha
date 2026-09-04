import { useSyncContext } from '../contexts/SyncContext.jsx';

function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function StatusBar() {
  const { isOnline, pendingCount, isSyncing, lastSyncAt } = useSyncContext();

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className={isOnline ? 'status-dot online' : 'status-dot offline'} />
        <span className="status-label">{isOnline ? 'Online' : 'Offline'}</span>
        {pendingCount > 0 && (
          <span className="pending-badge">{pendingCount} pending</span>
        )}
      </div>
      <div className="status-bar-right">
        {isSyncing && (
          <span className="syncing-label">
            <span className="sync-spinner" /> Syncing...
          </span>
        )}
        {!isSyncing && lastSyncAt && (
          <span className="last-sync">Synced {formatTime(lastSyncAt)}</span>
        )}
      </div>
    </div>
  );
}