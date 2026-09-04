/**
 * db/database.js
 * Uses node:sqlite — built into Node.js 22+. No npm install, no compilation.
 * Adds a thin compatibility shim (.pragma, .transaction) so all route files
 * work unchanged with the same better-sqlite3-style API.
 */

'use strict';

const { DatabaseSync } = require('node:sqlite');
const path    = require('path');
const fs      = require('fs');
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH     = path.join(__dirname, 'pashusuraksha.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// ── Open (or create) the SQLite file ─────────────────────────────────────────
const db = new DatabaseSync(DB_PATH);

// ── Compatibility shim ────────────────────────────────────────────────────────
// node:sqlite DatabaseSync has exec() and prepare() but lacks the
// .pragma() and .transaction() helpers that better-sqlite3 provides.

db.pragma = function pragmaShim(str) {
  try { this.exec('PRAGMA ' + str); } catch (_) {}
};

db.transaction = function transactionShim(fn) {
  const self = this;
  return function (...args) {
    self.exec('BEGIN');
    try {
      const result = fn(...args);
      self.exec('COMMIT');
      return result;
    } catch (e) {
      try { self.exec('ROLLBACK'); } catch (_) {}
      throw e;
    }
  };
};

// ── Pragmas ───────────────────────────────────────────────────────────────────
try { db.exec('PRAGMA journal_mode = WAL'); } catch (_) {}
try { db.exec('PRAGMA foreign_keys = ON'); } catch (_) {}

// ── Schema ────────────────────────────────────────────────────────────────────
const schemaSQL = fs.readFileSync(SCHEMA_PATH, 'utf8');
// Split on semicolons and run each statement individually (safer cross-version)
schemaSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 2)
  .forEach(s => {
    try { db.exec(s + ';'); } catch (e) {
      if (!e.message.includes('already exists')) {
        console.warn('[DB] schema warn:', e.message);
      }
    }
  });

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

// ── Seed: Users ───────────────────────────────────────────────────────────────
function seedUsers() {
  const row = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (row.c > 0) return;

  const ins = db.prepare(
    'INSERT INTO users (username, password, role, name, district) VALUES (?, ?, ?, ?, ?)'
  );
  ins.run('farmer1', bcrypt.hashSync('farmer123', 10), 'farmer', 'Raju Kumar',       'Rajkot');
  ins.run('vet1',    bcrypt.hashSync('vet123',    10), 'vet',    'Dr. Priya Sharma',  'Rajkot');
  console.log('[DB] Demo users seeded.');
}

// ── Seed: Reports ─────────────────────────────────────────────────────────────
function seedReports() {
  const row = db.prepare('SELECT COUNT(*) AS c FROM reports').get();
  if (row.c > 0) return;

  const ins = db.prepare(`
    INSERT INTO reports
      (id, local_id, user_id, species, syndrome, symptoms, mortality_count,
       herd_id, village, district, latitude, longitude, vaccination_status,
       captured_at, synced_at, status, notes)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
  `);

  const insSyncLog = db.prepare(
    'INSERT OR IGNORE INTO sync_log (local_id, report_id) VALUES (?, ?)'
  );

  const samples = [
    // ── FMD cluster in Rajkot — Gondal (forms a Case) ──────────────────────
    {
      id: uuidv4(), lid: 'LOCAL-001', uid: 1,
      species: 'Cattle', syndrome: 'FMD',
      symptoms: 'Blisters on tongue, excessive salivation, lameness',
      mort: 0, herd: 'HRD-GDL-01', village: 'Gondal', dist: 'Rajkot',
      lat: 22.3247, lng: 70.7897, vax: 'unvaccinated',
      cap: daysAgo(5), status: 'CASE',
      notes: 'Multiple animals affected in same herd',
    },
    {
      id: uuidv4(), lid: 'LOCAL-002', uid: 1,
      species: 'Cattle', syndrome: 'FMD',
      symptoms: 'Foot lesions, drooling, reduced milk yield',
      mort: 0, herd: 'HRD-GDL-02', village: 'Gondal', dist: 'Rajkot',
      lat: 22.3261, lng: 70.7912, vax: 'unvaccinated',
      cap: daysAgo(4), status: 'CASE',
      notes: "Neighbour's herd showing similar signs",
    },
    {
      id: uuidv4(), lid: 'LOCAL-003', uid: 1,
      species: 'Cattle', syndrome: 'FMD',
      symptoms: 'Blisters in mouth, high fever, anorexia',
      mort: 1, herd: 'HRD-GDL-03', village: 'Gondal', dist: 'Rajkot',
      lat: 22.3255, lng: 70.7880, vax: 'unvaccinated',
      cap: daysAgo(3), status: 'CASE',
      notes: 'One calf died overnight',
    },
    // ── FMD spreading to Jetpur (cluster) ──────────────────────────────────
    {
      id: uuidv4(), lid: 'LOCAL-004', uid: 1,
      species: 'Cattle', syndrome: 'FMD',
      symptoms: 'Oral blisters, limping severely',
      mort: 0, herd: 'HRD-JTP-01', village: 'Jetpur', dist: 'Rajkot',
      lat: 21.7531, lng: 70.6237, vax: 'unvaccinated',
      cap: daysAgo(6), status: 'CLUSTER',
      notes: 'Possibly same strain as Gondal reports',
    },
    {
      id: uuidv4(), lid: 'LOCAL-005', uid: 1,
      species: 'Cattle', syndrome: 'FMD',
      symptoms: 'Tongue vesicles, fever 104F',
      mort: 2, herd: 'HRD-JTP-02', village: 'Jetpur', dist: 'Rajkot',
      lat: 21.7548, lng: 70.6252, vax: 'unvaccinated',
      cap: daysAgo(5), status: 'CLUSTER',
      notes: 'Two deaths — elderly cows',
    },
    // ── PPR in goats — Surat ───────────────────────────────────────────────
    {
      id: uuidv4(), lid: 'LOCAL-006', uid: 1,
      species: 'Goat', syndrome: 'PPR',
      symptoms: 'High fever, nasal discharge, pneumonia, diarrhoea',
      mort: 3, herd: 'HRD-SRT-01', village: 'Olpad', dist: 'Surat',
      lat: 21.3505, lng: 72.7500, vax: 'unvaccinated',
      cap: daysAgo(10), status: 'CASE',
      notes: 'Rapid spread within flock of 60 animals',
    },
    {
      id: uuidv4(), lid: 'LOCAL-007', uid: 1,
      species: 'Goat', syndrome: 'PPR',
      symptoms: 'Crusty erosions in mouth, respiratory distress',
      mort: 5, herd: 'HRD-SRT-02', village: 'Olpad', dist: 'Surat',
      lat: 21.3520, lng: 72.7530, vax: 'unknown',
      cap: daysAgo(8), status: 'CASE',
      notes: 'High mortality rate — seeking vet support urgently',
    },
    // ── BQ (Blackquarter) — Vadodara ───────────────────────────────────────
    {
      id: uuidv4(), lid: 'LOCAL-008', uid: 1,
      species: 'Cattle', syndrome: 'BQ',
      symptoms: 'Sudden death, swollen hind leg, crepitation on palpation',
      mort: 2, herd: 'HRD-VDR-01', village: 'Karjan', dist: 'Vadodara',
      lat: 22.0554, lng: 73.1229, vax: 'unvaccinated',
      cap: daysAgo(15), status: 'REPORT',
      notes: 'Young bulls 1-2 years old affected',
    },
  ];

  const insertAll = db.transaction(() => {
    for (const r of samples) {
      ins.run(
        r.id, r.lid, r.uid, r.species, r.syndrome, r.symptoms,
        r.mort, r.herd, r.village, r.dist, r.lat, r.lng,
        r.vax, r.cap, r.status, r.notes
      );
      insSyncLog.run(r.lid, r.id);
    }
  });
  insertAll();
  console.log('[DB] Sample reports seeded.');
}

// ── Seed: Cases, Cluster, Outbreak, Lab ───────────────────────────────────────
function seedCasesAndClusters() {
  const row = db.prepare('SELECT COUNT(*) AS c FROM cases').get();
  if (row.c > 0) return;

  // Case 1: FMD Rajkot
  const fmdCaseResult = db.prepare(`
    INSERT INTO cases (syndrome, species, district, village, started_at, status, severity, report_count)
    VALUES ('FMD', 'Cattle', 'Rajkot', 'Gondal', ?, 'CLUSTER', 'HIGH', 5)
  `).run(daysAgo(6));
  const fmdCaseId = fmdCaseResult.lastInsertRowid;

  db.prepare(`UPDATE reports SET case_id = ? WHERE syndrome = 'FMD' AND species = 'Cattle'`)
    .run(fmdCaseId);

  // Case 2: PPR Surat
  const pprCaseResult = db.prepare(`
    INSERT INTO cases (syndrome, species, district, village, started_at, status, severity, report_count)
    VALUES ('PPR', 'Goat', 'Surat', 'Olpad', ?, 'CASE', 'CRITICAL', 2)
  `).run(daysAgo(10));
  const pprCaseId = pprCaseResult.lastInsertRowid;

  db.prepare(`UPDATE reports SET case_id = ? WHERE syndrome = 'PPR' AND species = 'Goat'`)
    .run(pprCaseId);

  // Cluster for FMD
  const clusterResult = db.prepare(`
    INSERT INTO clusters (case_id, label, center_lat, center_lng, radius_km, report_count, status)
    VALUES (?, 'FMD Rajkot District Cluster', 22.0397, 70.7080, 45, 5, 'CLUSTER')
  `).run(fmdCaseId);
  const clusterId = clusterResult.lastInsertRowid;

  // Suspected outbreak (5 reports + mortality > 0)
  db.prepare(`
    INSERT INTO suspected_outbreaks (cluster_id, status, notes)
    VALUES (?, 'SUSPECTED', 'Rapid multi-village spread of FMD in Rajkot. Mortality recorded. Vet confirmation required.')
  `).run(clusterId);

  // Lab sample for PPR
  const pprReport = db.prepare(`SELECT id FROM reports WHERE syndrome = 'PPR' LIMIT 1`).get();
  if (pprReport) {
    db.prepare(`
      INSERT INTO lab_samples (report_id, case_id, sample_type, submitted_at, status)
      VALUES (?, ?, 'Nasal Swab', ?, 'PENDING')
    `).run(pprReport.id, pprCaseId, daysAgo(7));
  }

  console.log('[DB] Cases, cluster, suspected outbreak, lab sample seeded.');
}

// ── Run seeds ─────────────────────────────────────────────────────────────────
seedUsers();
seedReports();
seedCasesAndClusters();

module.exports = db;
