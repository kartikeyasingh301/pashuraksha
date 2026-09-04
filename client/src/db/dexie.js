import Dexie from "dexie";

const db = new Dexie("PashuSurakshaDB");

db.version(1).stores({
  offlineQueue: "++id, localId, status, retryCount, capturedAt",
  reports: "id, status, capturedAt, synced",
  cases: "id, status",
  clusters: "id, status",
  userSession: "key"
});

export default db;
