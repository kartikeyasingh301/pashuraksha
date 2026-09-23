const fs = require('fs');
const path = require('path');

// 1. Patch alerts.js
const alertsFile = path.join(__dirname, 'routes/alerts.js');
let alertsCode = fs.readFileSync(alertsFile, 'utf8');

if(!alertsCode.includes('SentinelEngine')) {
    alertsCode = alertsCode.replace(
        "const { authenticateToken, requireVet } = require('../middleware/auth');",
        "const { authenticateToken, requireVet } = require('../middleware/auth');\nconst { augmentWithSentinel } = require('../pipeline/SentinelEngine');"
    );
    alertsCode = alertsCode.replace(
        "res.json({",
        "res.json({\n    critical: {\n      cases: criticalCases.map(augmentWithSentinel),\n      outbreaks: suspectedOutbreaks.map(augmentWithSentinel)\n    },\n    zoonotic: zoonotic.map(augmentWithSentinel),\n    emerging: emerging.map(augmentWithSentinel)\n  });\n  return;\n// old code below"
    );
    fs.writeFileSync(alertsFile, alertsCode, 'utf8');
}

// 2. Patch cases.js
const casesFile = path.join(__dirname, 'routes/cases.js');
let casesCode = fs.readFileSync(casesFile, 'utf8');

if(!casesCode.includes('SentinelEngine')) {
    casesCode = casesCode.replace(
        "const { authenticateToken, requireVet } = require('../middleware/auth');",
        "const { authenticateToken, requireVet } = require('../middleware/auth');\nconst { augmentWithSentinel } = require('../pipeline/SentinelEngine');"
    );
    casesCode = casesCode.replace(
        "res.json({ cases });",
        "res.json({ cases: cases.map(augmentWithSentinel) });"
    );
    casesCode = casesCode.replace(
        "res.json({ case: caseRecord, reports, clusters });",
        "res.json({ case: augmentWithSentinel(caseRecord), reports, clusters });"
    );
    fs.writeFileSync(casesFile, casesCode, 'utf8');
}
console.log("Backend routes patched to include Sentinel data.");
