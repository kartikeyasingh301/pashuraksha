const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/HerdLedger.jsx');
let code = fs.readFileSync(file, 'utf8');

// Replace avatars with emojis
code = code.replace(
  />\{a\.species\[0\]\}<\/div>/g,
  `>{a.species === 'Cattle' ? '🐄' : a.species === 'Buffalo' ? '🐃' : a.species === 'Sheep' ? '🐑' : a.species === 'Goat' ? '🐐' : a.species[0]}</div>`
);

// Filters 44px tall
code = code.replace(
  /<button key=\{f\} onClick=\{\(\) => setFilter\(f\)\} style=\{\{\s*padding:"6px 14px", borderRadius:"20px", border:"none", fontSize:"12px", fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap",\s*background: filter === f \? "#2E7D32" : "#F0F0F0", color: filter === f \? "white" : "#666"\s*\}\}>/g,
  `<button key={f} onClick={() => setFilter(f)} className={"chip " + (filter === f ? "active" : "")}>`
);

// Skeletons? HerdLedger is static, no loader mentioned.

fs.writeFileSync(file, code, 'utf8');
console.log("HerdLedger patched");
