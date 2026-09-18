const fs = require('fs');
const path = require('path');

// 1. Fix alerts.js
const alertsFile = path.join(__dirname, 'routes/alerts.js');
let alertsCode = fs.readFileSync(alertsFile, 'utf8');

const alertsTarget = `  res.json({
    critical: {
      cases: criticalCases.map(augmentWithSentinel),
      outbreaks: suspectedOutbreaks.map(augmentWithSentinel)
    },
    zoonotic: zoonotic.map(augmentWithSentinel),
    emerging: emerging.map(augmentWithSentinel)
  });
  return;
// old code below
    critical: {
      cases:    criticalCases,
      outbreaks: suspectedOutbreaks,
    },
    zoonotic,
    emerging,
  });
});

module.exports = router;`;

const alertsFix = `  res.json({
    critical: {
      cases: criticalCases.map(augmentWithSentinel),
      outbreaks: suspectedOutbreaks.map(augmentWithSentinel)
    },
    zoonotic: zoonotic.map(augmentWithSentinel),
    emerging: emerging.map(augmentWithSentinel)
  });
});

module.exports = router;`;

alertsCode = alertsCode.replace(alertsTarget, alertsFix);
fs.writeFileSync(alertsFile, alertsCode, 'utf8');


// 2. Fix cases.js
const casesFile = path.join(__dirname, 'routes/cases.js');
let casesCode = fs.readFileSync(casesFile, 'utf8');
const casesTarget1 = `res.json({ cases: cases.map(augmentWithSentinel) }); cases });`;
const casesTarget2 = `res.json({ case: augmentWithSentinel(caseRecord), reports, clusters }); case: caseRecord, reports, clusters });`;

if (casesCode.includes(casesTarget1)) {
    casesCode = casesCode.replace(casesTarget1, "res.json({ cases: cases.map(augmentWithSentinel) });");
}
if (casesCode.includes(casesTarget2)) {
    casesCode = casesCode.replace(casesTarget2, "res.json({ case: augmentWithSentinel(caseRecord), reports, clusters });");
}

fs.writeFileSync(casesFile, casesCode, 'utf8');

console.log("Routes fixed.");
