const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace 27 Animals with 20 Animals
code = code.replace(
  /<span style={{ fontSize:"12px", color:"#888" }}>27 Animals<\/span>/g,
  '<span style={{ fontSize:"12px", color:"#888" }}>20 Animals</span>'
);

// Replace 24 Healthy with 17 Healthy
code = code.replace(
  /<div style={{ fontSize:"20px", fontWeight:"800", color:"#2E7D32" }}>24<\/div>/g,
  '<div style={{ fontSize:"20px", fontWeight:"800", color:"#2E7D32" }}>17</div>'
);

// Replace 1 Active Case (static) with dynamic in the 20px font size block
code = code.replace(
  /<div style={{ fontSize:"20px", fontWeight:"800", color:"#C62828" }}>1<\/div>/g,
  '<div style={{ fontSize:"20px", fontWeight:"800", color:"#C62828" }}>{reports.filter(r => r.status === "CASE" || r.status === "REPORT" || r.status === "SUSPECTED_OUTBREAK").length}</div>'
);

// Replace 78% with 85%
code = code.replace(
  /<span style={{ fontSize:"13px", fontWeight:"700", color:"#2E7D32" }}>78%<\/span>/g,
  '<span style={{ fontSize:"13px", fontWeight:"700", color:"#2E7D32" }}>85%</span>'
);
code = code.replace(
  /width:"78%"/g,
  'width:"85%"'
);

fs.writeFileSync(file, code);
console.log("Dashboard math completely fixed");
