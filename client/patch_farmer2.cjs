const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx';
let code = fs.readFileSync(file, 'utf8');

// The actual emoji is 🎙️ (U+1F399 U+FE0F)
code = code.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]\s*Speak Your Problem/gu, '<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><Mic size={16} /> Voice Assistant</div>');
code = code.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]\s*Start Recording/gu, '<Mic size={24} /> Start Recording');
code = code.replace(/<div style=\{\{\s*width: "80px"[\s\S]*?>\s*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]?\s*<\/div>/gu, '<div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#4CAF50", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)", animation: "pulse 2s infinite" }}>\n              <Mic size={40} />\n            </div>');

fs.writeFileSync(file, code);
console.log('Emoji removed');
