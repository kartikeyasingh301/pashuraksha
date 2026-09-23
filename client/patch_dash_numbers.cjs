const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<div style={{ fontSize:"24px", fontWeight:"800", color:"#2E7D32" }}>27<\/div>/g,
  '<div style={{ fontSize:"24px", fontWeight:"800", color:"#2E7D32" }}>10</div>'
);

fs.writeFileSync(file, code);
console.log("Dashboard numbers patched");
