const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<div style={{ marginTop:"6px" }}>\s*<span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime\(report\.capturedAt \|\| report\.captured_at\)}<\/span>\s*<\/div>/g,
  `<div style={{ marginTop:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #f0f0f0", paddingTop:"10px" }}>
                      <span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime(report.capturedAt || report.captured_at)}</span>
                      <span style={{ fontSize:"12px", color:"#1B5E20", fontWeight:"700", display:"flex", alignItems:"center" }}>{t.viewReport}</span>
                    </div>`
);

fs.writeFileSync(file, code);
console.log("Dashboard view report patched FOR REAL");
