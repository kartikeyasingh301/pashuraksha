const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('REPORT CHANNELS')) {
    const channelsBlock = `
          {/* REPORT CHANNELS */}
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
              Report Channels
            </h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
               <div style={{ flex: "1 1 100px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                 <div style={{ fontSize: "24px", fontWeight: "800", color: "#1565C0" }}>60%</div>
                 <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginTop: "4px" }}>APP</div>
               </div>
               <div style={{ flex: "1 1 100px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                 <div style={{ fontSize: "24px", fontWeight: "800", color: "#2E7D32" }}>20%</div>
                 <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginTop: "4px" }}>VOICE</div>
               </div>
               <div style={{ flex: "1 1 100px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                 <div style={{ fontSize: "24px", fontWeight: "800", color: "#F57C00" }}>20%</div>
                 <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginTop: "4px" }}>IVR</div>
               </div>
            </div>
          </div>
    `;
    code = code.replace(
      '{/* ATTENTION REQUIRED */}',
      channelsBlock + '\n\n          {/* ATTENTION REQUIRED */}'
    );

    fs.writeFileSync(file, code, 'utf8');
    console.log("Patched Vet Dashboard");
}
