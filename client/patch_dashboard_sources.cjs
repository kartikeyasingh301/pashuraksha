const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /let appCount = 0, voiceCount = 0, ivrCount = 0;\s*reports\.forEach\(r => \{\s*if \(r\.source === 'VOICE'\) voiceCount\+\+;\s*else if \(r\.source === 'IVR'\) ivrCount\+\+;\s*else appCount\+\+;\s*\}\);\s*const total = appCount \+ voiceCount \+ ivrCount \|\| 1;\s*const appPct = Math\.round\(\(appCount \/ total\) \* 100\);\s*const voicePct = Math\.round\(\(voiceCount \/ total\) \* 100\);\s*const ivrPct = Math\.round\(\(ivrCount \/ total\) \* 100\);/g,
    `let appCount = 0, voiceCount = 0, ivrCount = 0, fieldWorkerCount = 0, webCount = 0;
          reports.forEach(r => {
             if (r.source === 'VOICE') voiceCount++;
             else if (r.source === 'IVR') ivrCount++;
             else if (r.source === 'FIELD_WORKER') fieldWorkerCount++;
             else if (r.source === 'WEB') webCount++;
             else appCount++;
          });
          const total = appCount + voiceCount + ivrCount + fieldWorkerCount + webCount || 1;
          const appPct = Math.round((appCount / total) * 100);
          const voicePct = Math.round((voiceCount / total) * 100);
          const ivrPct = Math.round((ivrCount / total) * 100);
          const fieldWorkerPct = Math.round((fieldWorkerCount / total) * 100);
          const webPct = Math.round((webCount / total) * 100);`
);

code = code.replace(
    /appPct, voicePct, ivrPct/g,
    'appPct, voicePct, ivrPct, fieldWorkerPct, webPct'
);

const oldChannels = `<div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
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
                     </div>`;

const newChannels = `<div style={{ flex: "1 1 80px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                       <div style={{ fontSize: "24px", fontWeight: "800", color: "#1565C0" }}>{summary.appPct}%</div>
                       <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", marginTop: "4px" }}>APP</div>
                     </div>
                     <div style={{ flex: "1 1 80px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                       <div style={{ fontSize: "24px", fontWeight: "800", color: "#7B1FA2" }}>{summary.voicePct}%</div>
                       <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", marginTop: "4px" }}>VOICE</div>
                     </div>
                     <div style={{ flex: "1 1 80px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                       <div style={{ fontSize: "24px", fontWeight: "800", color: "#E65100" }}>{summary.ivrPct}%</div>
                       <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", marginTop: "4px" }}>IVR</div>
                     </div>
                     <div style={{ flex: "1 1 80px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                       <div style={{ fontSize: "24px", fontWeight: "800", color: "#2E7D32" }}>{summary.fieldWorkerPct}%</div>
                       <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", marginTop: "4px" }}>FIELD WORKER</div>
                     </div>
                     <div style={{ flex: "1 1 80px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                       <div style={{ fontSize: "24px", fontWeight: "800", color: "#00695C" }}>{summary.webPct}%</div>
                       <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", marginTop: "4px" }}>WEB</div>
                     </div>`;

code = code.replace(oldChannels, newChannels);

fs.writeFileSync(file, code, 'utf8');
console.log("Dashboard analytics patched for all channels!");
