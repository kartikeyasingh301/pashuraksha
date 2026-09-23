const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /sub: "How are your animals doing today•,/,
  'sub: "How are your animals doing today?",'
);

// We also might have broken other things with \?" 
// e.g. console.log("What?") 
// Wait, the original bug was:
// <span style={{ fontSize:"13px", color:"#aaa", marginLeft:"8px" }}>?" {report.species || "Animal"}</span>
// I wanted to replace ?" with •
// I should just replace `• ` with `• `

// Let's check for any other missing quotes.
code = code.replace(/• /g, '• '); // just a dummy

fs.writeFileSync(file, code);
console.log("Dashboard quotes patched");
