const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CriticalAlerts.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<div style=\{\{\s*padding:\s*"16px 20px",\s*background:\s*"white",\s*borderTop:\s*"1px solid #e0e0e0"/g,
  `<div style={{ padding: "16px 20px", paddingBottom: "calc(16px + env(safe-area-inset-bottom))", background: "var(--surface)", borderTop: "1px solid var(--border)"`
);

fs.writeFileSync(file, code, 'utf8');
