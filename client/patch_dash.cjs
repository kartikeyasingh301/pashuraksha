const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Fix Active Case count dynamically
code = code.replace(
  /<div style={{ fontSize:"24px", fontWeight:"800", color:"#C62828" }}>1<\/div>/g,
  '<div style={{ fontSize:"24px", fontWeight:"800", color:"#C62828" }}>{reports.filter(r => r.status === "CASE" || r.status === "REPORT" || r.status === "SUSPECTED_OUTBREAK").length}</div>'
);

// Fix Gujarat Tag to Maharashtra Tag
code = code.replace(
  "GJ-RJ-4831 under observation",
  "MH-NK-4821 under observation"
);

// Replace broken • icon in report with a dot
code = code.replace(
  /\?"/g,
  "•"
);

// Replace broken > icon in advisory with Lucide ChevronRight
code = code.replace(
  /<span style={{ fontSize:"22px", color:"#aaa" }}>\?<\/span>/g,
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
);

fs.writeFileSync(file, code);
console.log("Dashboard patched");
