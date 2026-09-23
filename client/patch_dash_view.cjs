const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add viewReport translations
code = code.replace(
  'recent: "Your Recent Reports",',
  'recent: "Your Recent Reports",\n      viewReport: "View Report Detail >",'
);
code = code.replace(
  'recent: "आपकी हालिया रिपोर्ट",',
  'recent: "आपकी हालिया रिपोर्ट",\n      viewReport: "रिपोर्ट विवरण देखें >",'
);
code = code.replace(
  'recent: "तुमचे अलीकडील अहवाल",',
  'recent: "तुमचे अलीकडील अहवाल",\n      viewReport: "अहवाल तपशील पहा >",'
);

// Add the button to the UI
const uiToReplace = `<div style={{ marginTop:"6px" }}>
                    <span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime(report.capturedAt || report.captured_at)}</span>
                  </div>`;
const replacementUI = `<div style={{ marginTop:"6px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime(report.capturedAt || report.captured_at)}</span>
                    <span style={{ fontSize:"12px", color:"#1B5E20", fontWeight:"700" }}>{t.viewReport}</span>
                  </div>`;

code = code.replace(uiToReplace, replacementUI);

fs.writeFileSync(file, code);
console.log("Dashboard view report patched");
