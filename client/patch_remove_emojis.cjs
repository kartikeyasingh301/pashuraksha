const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

// The file currently imports Mic, but we also need FileText
if (!code.includes('FileText')) {
  code = code.replace(/Mic, Square/, 'Mic, Square, FileText');
}

// Replace emojis with Lucide icons
code = code.replace(
  />📝 Standard Report<\/button>/g,
  '><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><FileText size={16} /> Standard Report</div></button>'
);

code = code.replace(
  />🎙️ Speak Your Problem<\/button>/g,
  '><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><Mic size={16} /> Speak Your Problem</div></button>'
);

fs.writeFileSync(file, code, 'utf8');
console.log('Emojis replaced with professional Lucide icons!');
