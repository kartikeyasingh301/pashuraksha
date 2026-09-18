const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/ResponseQueue.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Source:')) {
    code = code.replace(
        '<div style={{ fontSize: "12px", color: "#666" }}><Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }}/> SLA: 01:24 remaining</div>',
        '<div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}><strong>Source:</strong> {item.source || "IVR"}</div>\n                             <div style={{ fontSize: "12px", color: "#666" }}><Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }}/> SLA: 01:24 remaining</div>'
    );
}

fs.writeFileSync(file, code, 'utf8');
console.log("Response Queue Source patched!");
