const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'src/pages/vet/CriticalAlerts.jsx');
let code1 = fs.readFileSync(file1, 'utf8');

if (!code1.includes('Source:</span>')) {
    code1 = code1.replace(
      'Signal:</span> <span style={{ fontWeight: "700" }}>{item.sentinel?.risk_level}</span>',
      'Signal:</span> <span style={{ fontWeight: "700" }}>{item.sentinel?.risk_level}</span>\n                </div>\n                <div style={{ flex: 1, color: "#666" }}>\n                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", marginRight: "4px" }}>Source:</span> <span style={{ fontWeight: "700", color: "#1565C0" }}>Mixed (Voice/App)</span>'
    );
    fs.writeFileSync(file1, code1, 'utf8');
}

const file2 = path.join(__dirname, 'src/pages/vet/ResponseQueue.jsx');
let code2 = fs.readFileSync(file2, 'utf8');

if (!code2.includes('Source:</span>')) {
    code2 = code2.replace(
      'Signal:</span> <span style={{ fontWeight: "700" }}>{item.sentinel?.risk_level}</span>',
      'Signal:</span> <span style={{ fontWeight: "700" }}>{item.sentinel?.risk_level}</span>\n                </div>\n                <div style={{ flex: 1, color: "#666" }}>\n                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", marginRight: "4px" }}>Source:</span> <span style={{ fontWeight: "700", color: "#1565C0" }}>Mixed</span>'
    );
    fs.writeFileSync(file2, code2, 'utf8');
}

console.log("Patched Alerts and Queue for Source display");
