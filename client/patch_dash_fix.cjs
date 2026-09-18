const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    "appPct, voicePct, ivrPct, fieldWorkerPct, webPct",
    "appPct, voicePct, ivrPct, fieldWorkerPct: 0, webPct: 0"
);

fs.writeFileSync(file, code, 'utf8');
console.log("Fixed undefined fieldWorkerPct variables in Dashboard.jsx!");
