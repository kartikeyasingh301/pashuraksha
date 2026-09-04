import db from '../db/dexie.js';
import { apiBatch } from '../api/client.js';

export async function addToQueue(report) {
  await db.offlineQueue.add({
    ...report,
    status: 'pending',
    retryCount: 0,
    capturedAt: report.capturedAt || new Date().toISOString(),
  });
}

export async function getPendingCount() {
  return db.offlineQueue.where('status').equals('pending').count();
}

export async function syncQueue() {
  const pending = await db.offlineQueue.where('status').equals('pending').toArray();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  try {
    const result = await apiBatch(pending);
    const succeededIds = result.succeeded || pending.map((p) => p.id);
    const failedIds = result.failed || [];

    for (const item of pending) {
      if (failedIds.includes(item.id)) {
        const newCount = (item.retryCount || 0) + 1;
        if (newCount >= 5) {
          await db.offlineQueue.update(item.id, { status: 'failed', retryCount: newCount });
        } else {
          await db.offlineQueue.update(item.id, { retryCount: newCount });
        }
        failed++;
      } else {
        await db.offlineQueue.delete(item.id);
        synced++;
      }
    }
  } catch (err) {
    for (const item of pending) {
      const newCount = (item.retryCount || 0) + 1;
      if (newCount >= 5) {
        await db.offlineQueue.update(item.id, { status: 'failed', retryCount: newCount });
      } else {
        await db.offlineQueue.update(item.id, { retryCount: newCount });
      }
    }
    failed = pending.length;
  }

  return { synced, failed };
}

export function registerSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.sync.register('sync-reports').catch((err) => {
        console.warn('Background sync registration failed:', err);
        window.addEventListener('online', () => syncQueue());
      });
    });
  } else {
    window.addEventListener('online', () => syncQueue());
  }
}