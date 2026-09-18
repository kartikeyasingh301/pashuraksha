const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CriticalAlerts.jsx');
let code = fs.readFileSync(file, 'utf8');

const sourceMixBlock = `
            <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "20px" }}>
               <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>Report Source Mix</h3>
               <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1, background: "#E3F2FD", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#1565C0" }}>7</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#1565C0" }}>APP</div>
                  </div>
                  <div style={{ flex: 1, background: "#F3E5F5", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#7B1FA2" }}>3</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#7B1FA2" }}>VOICE</div>
                  </div>
                  <div style={{ flex: 1, background: "#FFF3E0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#E65100" }}>2</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#E65100" }}>IVR</div>
                  </div>
               </div>
            </div>
`;

if (!code.includes('Report Source Mix')) {
    code = code.replace(
        '<h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>System Interpretation</h3>',
        `${sourceMixBlock}\n\n            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>System Interpretation</h3>`
    );
    
    // Also add "Source Mix" info directly onto the Alert Card
    code = code.replace(
        '<strong>Why flagged:</strong> {item.sentinel?.reasons?.[0]}',
        '<span style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", marginRight: "8px" }}>Source Mix: APP/VOICE/IVR</span>\n                             <strong>Why flagged:</strong> {item.sentinel?.reasons?.[0]}'
    );
}

fs.writeFileSync(file, code, 'utf8');
console.log("Critical Alerts DNA Source Mix patched!");
