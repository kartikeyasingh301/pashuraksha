const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Fetch reports
code = code.replace(
  "apiGet('/cases').catch(() => ({ cases: [] })),",
  "apiGet('/cases').catch(() => ({ cases: [] })),\n          apiGet('/reports').catch(() => ({ reports: [] })),"
);
code = code.replace(
  "const [alertsData, casesData, labData] = await Promise.all([",
  "const [alertsData, casesData, reportsData, labData] = await Promise.all(["
);

// 2. Parse reports
code = code.replace(
  "const emerging = alertsData.emerging || [];",
  `const emerging = alertsData.emerging || [];
        const reports = reportsData.reports || [];
        
        let appCount = 0; let voiceCount = 0; let ivrCount = 0;
        reports.forEach(r => {
           if (r.source === 'VOICE') voiceCount++;
           else if (r.source === 'IVR') ivrCount++;
           else appCount++;
        });
        const total = appCount + voiceCount + ivrCount || 1;
        const appPct = Math.round((appCount / total) * 100);
        const voicePct = Math.round((voiceCount / total) * 100);
        const ivrPct = Math.round((ivrCount / total) * 100);`
);

// 3. Add to summary state
code = code.replace(
  "attentionQueue: attentionQueue.slice(0, 5) // Top 5 priority items",
  "attentionQueue: attentionQueue.slice(0, 5), // Top 5 priority items\n          appPct, voicePct, ivrPct"
);

// 4. Inject UI before Attention Required Zone
const channelsBlock = `
              {/* REPORT CHANNELS (ANALYTICS) */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#333", margin: "0 0 16px 0", textTransform: "uppercase" }}>Report Sources</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#1565C0" }}>{summary.appPct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>APP / WEB</div>
                   </div>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#7B1FA2" }}>{summary.voicePct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>VOICE</div>
                   </div>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#E65100" }}>{summary.ivrPct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>IVR</div>
                   </div>
                </div>
              </div>
`;

code = code.replace(
  "{/* ATTENTION REQUIRED ZONE */}",
  channelsBlock + "\n              {/* ATTENTION REQUIRED ZONE */}"
);

fs.writeFileSync(file, code, 'utf8');
console.log("Patched Vet Dashboard with dynamic analytics");
