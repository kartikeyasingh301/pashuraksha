# 🐄 PashuSuraksha — Pashu Swasthya Rakshak

> Animal Health Surveillance & Response Platform — Progressive Web App

---

## Quick Start

### Prerequisites
- **Node.js** ≥ 18 — download from https://nodejs.org/
- npm (bundled with Node.js)

### 1. Start the Backend

```powershell
cd C:\Users\KARTIKEYA\.gemini\antigravity\scratch\pashusuraksha\server
npm install
npm start
```

Server starts at **http://localhost:3001**

Demo credentials printed in terminal:
- Farmer: `farmer1` / `farmer123`
- Vet: `vet1` / `vet123`

### 2. Start the Frontend (new terminal)

```powershell
cd C:\Users\KARTIKEYA\.gemini\antigravity\scratch\pashusuraksha\client
npm install
npm run dev
```

Frontend at **http://localhost:5173**

### 3. Install as PWA

Open Chrome → visit http://localhost:5173 → click the **install icon** in the address bar → "Install PashuSuraksha"

---

## Offline Test Flow

```
1. Open DevTools → Application → Service Workers → check "Offline"
   OR: DevTools → Network → select "Offline"
2. Navigate to /farmer/report
3. Fill out: Species=Cattle, Syndrome=FMD, Village=TestVillage
4. Click "💾 Save Offline"
5. See "Saved offline — will sync when connected"
6. DevTools → Application → IndexedDB → PashuSurakshaDB → offlineQueue (1 record)
7. Status bar shows: "● Offline  [1 pending]"
8. DevTools → Network → "No throttling" (back online)
9. Within 3 seconds, sync fires automatically
10. offlineQueue table is now empty
11. Report appears in server SQLite
```

---

## Architecture

```
Client (PWA)                Backend (Express)
─────────────               ──────────────────
React + Vite                Node.js + SQLite
Service Worker              REST API
IndexedDB (Dexie)           Pipeline Engine
Offline Queue               JWT Auth + Dedup
Leaflet Maps                Disease Escalation
```

## Disease Pipeline

```
REPORT → CASE → CLUSTER → SUSPECTED_OUTBREAK → RESPONSE → CONFIRMED*

* CONFIRMED requires MANUAL veterinarian action. Never automatic.
```

**Escalation rules:**
- ≥2 same syndrome+species+village reports within 7 days → **CASE**
- ≥3 reports across ≥2 villages within 14 days → **CLUSTER**
- ≥5 cluster reports + mortality > 0 → **SUSPECTED_OUTBREAK** (vet alerted)
- Vet explicitly confirms → **CONFIRMED** (via `/api/outbreaks/:id/confirm`)

---

## Project Structure

```
pashusuraksha/
├── server/              # Node.js + Express + SQLite
│   ├── app.js
│   ├── db/
│   │   ├── schema.sql
│   │   └── database.js  (seeds demo data)
│   ├── middleware/
│   │   ├── auth.js      (JWT)
│   │   └── dedup.js     (offline sync dedup)
│   ├── pipeline/
│   │   └── engine.js    (escalation logic)
│   └── routes/          (9 route files)
│
└── client/              # React + Vite PWA
    ├── vite.config.js   (VitePWA + Workbox)
    ├── public/
    │   ├── manifest.json
    │   └── icons/
    └── src/
        ├── db/dexie.js          (IndexedDB)
        ├── sync/syncManager.js  (offline queue)
        ├── hooks/               (online, pending, GPS)
        ├── contexts/            (Auth, Sync)
        ├── pages/farmer/        (Dashboard, ReportForm, Advisory)
        ├── pages/vet/           (7 panels)
        └── components/          (Layout, StatusBar, LeafletMap...)
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Current user |
| POST | `/api/reports` | Submit report (with dedup) |
| POST | `/api/reports/batch` | Sync offline queue |
| GET | `/api/reports` | List reports |
| GET | `/api/cases` | All cases (vet) |
| POST | `/api/cases/:id/response` | Add response action |
| GET | `/api/clusters` | Clusters (vet) |
| GET | `/api/alerts` | Critical alerts (vet) |
| GET | `/api/map/incidents` | GeoJSON for Leaflet |
| GET | `/api/vaccination/gaps` | Unvaccinated villages |
| GET | `/api/lab` | Lab sample status |
| GET | `/api/outbreaks` | Suspected outbreaks |
| POST | `/api/outbreaks/:id/confirm` | Manual vet confirmation |

---

## PWA Features

| Feature | Implementation |
|---------|---------------|
| Installable | `manifest.json` + HTTPS/localhost |
| App shell caching | Workbox CacheFirst (install) |
| API caching | Workbox NetworkFirst |
| Map tile caching | Workbox StaleWhileRevalidate |
| Offline reports | IndexedDB `offlineQueue` table |
| Auto-sync | `online` event + Background Sync API |
| Deduplication | `local_id` in IndexedDB + `sync_log` in SQLite |
| Pending count | `usePendingSync` hook polls Dexie every 3s |
| Timestamp | `capturedAt` set client-side, preserved through sync |
| Retry on failure | Max 5 retries, exponential approach |

---

## Seed Data

8 realistic animal health reports across Gujarat:

| # | Species | Syndrome | Village | District | Status |
|---|---------|----------|---------|----------|--------|
| 1-3 | Cattle | FMD | Gondal | Rajkot | CASE |
| 4-5 | Cattle | FMD | Jetpur | Rajkot | CLUSTER |
| 6-7 | Goat | PPR | Olpad | Surat | CASE (CRITICAL) |
| 8 | Cattle | BQ | Karjan | Vadodara | REPORT |

Pre-seeded: 1 Suspected Outbreak (FMD Rajkot), 1 lab sample (PPR Surat)
