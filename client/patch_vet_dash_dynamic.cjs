const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

if (code.includes('60%')) {
    // We need to add fetching of reports
    code = code.replace(
      'apiGet(\'/cases\').catch(() => ({ cases: [] })),',
      'apiGet(\'/cases\').catch(() => ({ cases: [] })),\n            apiGet(\'/reports\').catch(() => ({ reports: [] })),'
    );
    
    code = code.replace(
      'const [alertsData, casesData, labData] = await Promise.all',
      'const [alertsData, casesData, reportsData, labData] = await Promise.all'
    );
    
    code = code.replace(
      'const emerging = alertsData.emerging || [];',
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
        const ivrPct = Math.round((ivrCount / total) * 100);
      `
    );
    
    code = code.replace(
      'totalCases: cases.length,',
      'totalCases: cases.length,\n            appPct, voicePct, ivrPct,'
    );
    
    code = code.replace(
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#1565C0" }}>60%</div>',
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#1565C0" }}>{summary.appPct}%</div>'
    );
    code = code.replace(
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#2E7D32" }}>20%</div>',
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#2E7D32" }}>{summary.voicePct}%</div>'
    );
    code = code.replace(
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#F57C00" }}>20%</div>',
      '<div style={{ fontSize: "24px", fontWeight: "800", color: "#F57C00" }}>{summary.ivrPct}%</div>'
    );
    
    fs.writeFileSync(file, code, 'utf8');
    console.log("Patched Vet Dashboard with dynamic percentages");
}
