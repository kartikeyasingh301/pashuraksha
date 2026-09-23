const fs = require('fs');
const path = require('path');

const schemaFile = path.join(__dirname, 'db/schema.sql');
let schema = fs.readFileSync(schemaFile, 'utf8');

if (!schema.includes("source TEXT DEFAULT 'APP'")) {
    schema = schema.replace(
        "created_at        TEXT DEFAULT (datetime('now'))\n);",
        "created_at        TEXT DEFAULT (datetime('now')),\n  source            TEXT DEFAULT 'APP'\n);"
    );
    fs.writeFileSync(schemaFile, schema, 'utf8');
}

const dbFile = path.join(__dirname, 'db/database.js');
let dbCode = fs.readFileSync(dbFile, 'utf8');

if (!dbCode.includes('source:')) {
    // We add source to the FMD/PPR scenario seed in database.js
    // I need to carefully add source values to the insertReports array
    // Let's replace the whole insert pattern if possible, or just append "source" logic.
    dbCode = dbCode.replace(
      'latitude, longitude, captured_at) VALUES',
      'latitude, longitude, captured_at, source) VALUES'
    );
    dbCode = dbCode.replace(
      'r.latitude || null, r.longitude || null, r.captured_at',
      "r.latitude || null, r.longitude || null, r.captured_at, r.source || 'APP'"
    );
    
    // Add some sources to the raw seed data array (if we can find it)
    // The previous Batch 2 created reports array like: [{ species: 'Cattle', syndrome: 'FMD' ... }]
    // It's safer to just run an ALTER TABLE locally on the sqlite file, and append to database.js
    
    fs.writeFileSync(dbFile, dbCode, 'utf8');
}

console.log("Schema patched with source column.");
