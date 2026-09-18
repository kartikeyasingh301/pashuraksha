const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db/database.js');
let dbCode = fs.readFileSync(dbFile, 'utf8');

// 1. Modify insRep SQL
const targetIns = `INSERT INTO reports (id, local_id, user_id, species, syndrome, symptoms, mortality_count, herd_id, village, district, latitude, longitude, vaccination_status, captured_at, synced_at, status, case_id, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)`;
const replacementIns = `INSERT INTO reports (id, local_id, user_id, species, syndrome, symptoms, mortality_count, herd_id, village, district, latitude, longitude, vaccination_status, captured_at, synced_at, status, case_id, notes, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?)`;
dbCode = dbCode.replace(targetIns, replacementIns);

// 2. Modify rps.forEach call
dbCode = dbCode.replace(
  "rps.forEach(r => insRep.run(r.i, r.l, r.u, r.sp, r.syn, r.sym, r.m, r.h, r.v, r.d, r.la, r.ln, r.vx, r.cap, r.st, r.cid, r.n));",
  "rps.forEach(r => insRep.run(r.i, r.l, r.u, r.sp, r.syn, r.sym, r.m, r.h, r.v, r.d, r.la, r.ln, r.vx, r.cap, r.st, r.cid, r.n, r.source || 'APP'));"
);

// 3. Inject sources into the JSON array items
dbCode = dbCode.replace(
  "{ i: uuidv4(), l:'LOC-3',",
  "{ source: 'VOICE', i: uuidv4(), l:'LOC-3',"
);

dbCode = dbCode.replace(
  "{ i: uuidv4(), l:'LOC-4',",
  "{ source: 'IVR', i: uuidv4(), l:'LOC-4',"
);

dbCode = dbCode.replace(
  "{ i: uuidv4(), l:'LOC-5',",
  "{ source: 'VOICE', i: uuidv4(), l:'LOC-5',"
);

fs.writeFileSync(dbFile, dbCode, 'utf8');
console.log("Patched database.js to include sources.");
