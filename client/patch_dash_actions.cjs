const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// FMD Vaccination Due
code = code.replace(
  /<div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#FFF8E1", borderRadius:"10px", borderLeft:"3px solid #F57F17" }}>/g,
  '<div onClick={() => navigate("/farmer/passbook")} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#FFF8E1", borderRadius:"10px", borderLeft:"3px solid #F57F17", cursor:"pointer" }}>'
);

// Follow-up Required
code = code.replace(
  /<div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#E3F2FD", borderRadius:"10px", borderLeft:"3px solid #1565C0" }}>/g,
  '<div onClick={() => navigate("/farmer/herd")} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#E3F2FD", borderRadius:"10px", borderLeft:"3px solid #1565C0", cursor:"pointer" }}>'
);

// FMD Advisory Active
code = code.replace(
  /<div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#FFEBEE", borderRadius:"10px", borderLeft:"3px solid #C62828" }}>/g,
  '<div onClick={() => navigate("/farmer/advisory")} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:"#FFEBEE", borderRadius:"10px", borderLeft:"3px solid #C62828", cursor:"pointer" }}>'
);

fs.writeFileSync(file, code);
console.log("Dashboard upcoming actions patched");
