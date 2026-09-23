const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'routes/reports.js');
let code = fs.readFileSync(file, 'utf8');

// For Single Report
code = code.replace(
  "vaccination_status, captured_at, synced_at, status, notes)",
  "vaccination_status, captured_at, synced_at, status, notes, source)"
);
code = code.replace(
  "?, ?, ?, ?, ?, ?, ?, ?, 'REPORT', ?)",
  "?, ?, ?, ?, ?, ?, ?, ?, 'REPORT', ?, ?)"
);
code = code.replace(
  "notes || null",
  "notes || null,\n      req.body.source || 'APP'"
);

// For Batch Reports
code = code.replace(
  "latitude, longitude, vaccination_status, captured_at, synced_at, notes)",
  "latitude, longitude, vaccination_status, captured_at, synced_at, notes, source)"
);
code = code.replace(
  "?, ?, ?, ?, ?, ?)",
  "?, ?, ?, ?, ?, ?, ?)"
);
code = code.replace(
  "r.notes || null",
  "r.notes || null,\n        r.source || 'APP'"
);

fs.writeFileSync(file, code, 'utf8');
console.log("Patched reports API");
