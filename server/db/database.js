'use strict';
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'pashusuraksha.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const db = new DatabaseSync(DB_PATH);

db.pragma = function(str) { try { this.exec('PRAGMA ' + str); } catch (_) {} };
db.transaction = function(fn) {
  const self = this;
  return function (...args) {
    self.exec('BEGIN');
    try { const result = fn(...args); self.exec('COMMIT'); return result; }
    catch (e) { try { self.exec('ROLLBACK'); } catch (_) {} throw e; }
  };
};

try { db.exec('PRAGMA journal_mode = WAL'); } catch (_) {}
try { db.exec('PRAGMA foreign_keys = ON'); } catch (_) {}

const schemaSQL = fs.readFileSync(SCHEMA_PATH, 'utf8');
schemaSQL.split(';').map(s => s.trim()).filter(s => s.length > 2).forEach(s => {
  try { db.exec(s + ';'); } catch (e) {
    if (!e.message.includes('already exists')) console.warn('[DB] schema warn:', e.message);
  }
});

function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

const transactionSeed = db.transaction(() => {
  // Clear existing for clean deterministic seed
  ['sync_log', 'lab_samples', 'responses', 'suspected_outbreaks', 'clusters', 'cases', 'reports', 'users'].forEach(t => {
    try { db.exec(`DELETE FROM ${t}`); } catch (e) {}
  });
  
  // 1. Users
  const insUser = db.prepare('INSERT INTO users (id, username, password, role, name, district) VALUES (?, ?, ?, ?, ?, ?)');
  insUser.run(1, 'farmer1', bcrypt.hashSync('farmer123', 10), 'farmer', 'Raju Kumar', 'Rajkot');
  insUser.run(2, 'vet1', bcrypt.hashSync('vet123', 10), 'vet', 'Dr. Priya Sharma', 'Rajkot');

  // 2. Cases
  const insCase = db.prepare(`INSERT INTO cases (id, syndrome, species, district, village, started_at, status, severity, report_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insCase.run(101, 'FMD', 'Cattle', 'Rajkot', 'Gondal', daysAgo(6), 'CLUSTER', 'HIGH', 3);
  insCase.run(102, 'PPR', 'Goat', 'Surat', 'Olpad', daysAgo(10), 'CASE', 'CRITICAL', 2);
  insCase.run(103, 'BQ', 'Buffalo', 'Vadodara', 'Karjan', daysAgo(2), 'CASE', 'MEDIUM', 1);

  // 3. Clusters
  const insCluster = db.prepare(`INSERT INTO clusters (id, case_id, label, center_lat, center_lng, radius_km, report_count, status, detected_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insCluster.run(201, 101, 'FMD Rajkot District Cluster', 22.0397, 70.7080, 25.5, 5, 'SUSPECTED_OUTBREAK', daysAgo(3));

  // 4. Suspected Outbreaks
  const insOutbreak = db.prepare(`INSERT INTO suspected_outbreaks (id, cluster_id, suspected_at, status, notes) VALUES (?, ?, ?, ?, ?)`);
  insOutbreak.run(301, 201, daysAgo(3), 'SUSPECTED', 'Rapid multi-village spread of FMD in Rajkot. Mortality recorded. Vet confirmation required.');

  // 5. Responses
  const insResp = db.prepare(`INSERT INTO responses (id, outbreak_id, vet_id, action_type, description, scheduled_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  insResp.run(401, 301, 2, 'VACCINATION_DRIVE', 'Ring vaccination planned for Gondal & Jetpur villages (10km radius)', daysAgo(1), daysAgo(1));
  insResp.run(402, 301, 2, 'SAMPLE_COLLECTION', 'Collect vesicular fluid and epithelial tissue for ICAR-NIVEDI', daysAgo(2), daysAgo(2));

  // 6. Reports (Link back to cases/users)
  const insRep = db.prepare(`
    INSERT INTO reports (id, local_id, user_id, species, syndrome, symptoms, mortality_count, herd_id, village, district, latitude, longitude, vaccination_status, captured_at, synced_at, status, case_id, notes, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?)
  `);
  const rps = [
    // Gondal FMD Reports (Farmer 1) -> Case 101, Cluster 201
    { i: uuidv4(), l:'LOC-1', u:1, sp:'Cattle', syn:'FMD', sym:'Blisters/Ulcers, Lameness, Excessive Salivation', m:0, h:'GJ-RJ-4821', v:'Gondal', d:'Rajkot', la:22.3247, ln:70.7897, vx:'unvaccinated', cap:daysAgo(5), st:'SUSPECTED_OUTBREAK', cid:101, n:'Multiple animals affected in same herd' },
    { i: uuidv4(), l:'LOC-2', u:1, sp:'Cattle', syn:'FMD', sym:'Fever, Skin Lesions, Loss of appetite', m:0, h:'GJ-RJ-4822', v:'Gondal', d:'Rajkot', la:22.3261, ln:70.7912, vx:'unvaccinated', cap:daysAgo(4), st:'SUSPECTED_OUTBREAK', cid:101, n:'Neighbours herd showing similar signs' },
    { source: 'VOICE', i: uuidv4(), l:'LOC-3', u:1, sp:'Cattle', syn:'FMD', sym:'Blisters/Ulcers, Fever', m:1, h:'GJ-RJ-4850', v:'Gondal', d:'Rajkot', la:22.3255, ln:70.7880, vx:'unvaccinated', cap:daysAgo(3), st:'SUSPECTED_OUTBREAK', cid:101, n:'One calf died overnight' },
    // Jetpur FMD Reports (Farmer 1) -> Cluster 201
    { source: 'IVR', i: uuidv4(), l:'LOC-4', u:1, sp:'Cattle', syn:'FMD', sym:'Blisters/Ulcers, Lameness', m:0, h:'GJ-RJ-4870', v:'Jetpur', d:'Rajkot', la:21.7531, ln:70.6237, vx:'unvaccinated', cap:daysAgo(6), st:'SUSPECTED_OUTBREAK', cid:101, n:'Possibly same strain as Gondal reports' },
    { source: 'VOICE', i: uuidv4(), l:'LOC-5', u:1, sp:'Cattle', syn:'FMD', sym:'Blisters/Ulcers, Fever', m:2, h:'GJ-RJ-4888', v:'Jetpur', d:'Rajkot', la:21.7548, ln:70.6252, vx:'unvaccinated', cap:daysAgo(5), st:'SUSPECTED_OUTBREAK', cid:101, n:'Two deaths - elderly cows' },
    // Olpad PPR Reports (Unknown farmer) -> Case 102
    { i: uuidv4(), l:'LOC-6', u:1, sp:'Goat', syn:'PPR', sym:'Diarrhea, Respiratory distress', m:3, h:'GJ-SU-11', v:'Olpad', d:'Surat', la:21.3283, ln:72.7441, vx:'unvaccinated', cap:daysAgo(10), st:'CASE', cid:102, n:'Severe flock outbreak' },
    { i: uuidv4(), l:'LOC-7', u:1, sp:'Goat', syn:'PPR', sym:'Fever, Nasal Discharge', m:5, h:'GJ-SU-12', v:'Olpad', d:'Surat', la:21.3300, ln:72.7450, vx:'unvaccinated', cap:daysAgo(9), st:'CASE', cid:102, n:'Spreading fast' },
    // Karjan BQ Report (Unknown farmer) -> Case 103
    { i: uuidv4(), l:'LOC-8', u:1, sp:'Buffalo', syn:'BQ', sym:'Swelling, Sudden death', m:2, h:'GJ-VD-99', v:'Karjan', d:'Vadodara', la:22.0465, ln:73.1251, vx:'unknown', cap:daysAgo(2), st:'CASE', cid:103, n:'Sudden collapse in field' }
  ];
  
  rps.forEach(r => insRep.run(r.i, r.l, r.u, r.sp, r.syn, r.sym, r.m, r.h, r.v, r.d, r.la, r.ln, r.vx, r.cap, r.st, r.cid, r.n, r.source || 'APP'));

  // 7. Lab Samples
  const insLab = db.prepare(`INSERT INTO lab_samples (id, report_id, case_id, sample_type, submitted_at, result, result_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  insLab.run(501, rps[0].i, 101, 'Vesicular Fluid', daysAgo(3), null, null, 'PENDING');
  insLab.run(502, rps[5].i, 102, 'Nasal Swab', daysAgo(8), 'PPRV_POSITIVE', daysAgo(2), 'COMPLETED');
  insLab.run(503, rps[3].i, 101, 'Epithelial Tissue', daysAgo(2), null, null, 'PENDING');
});

transactionSeed();
console.log('[DB] Fully Deterministic Demo Data Seeded for SIH.');
module.exports = db;
