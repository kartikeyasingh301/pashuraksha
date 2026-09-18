const fs = require('fs');
const path = require('path');

// Utilities
function replaceInFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    code = code.replace(regex, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

function replaceAllInFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    // regex should have 'g' flag
    code = code.replace(regex, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

// 2.1 Color by meaning
// CriticalAlerts.jsx & ResponseQueue.jsx: "SLA at risk" chip
replaceAllInFile('pages/vet/CriticalAlerts.jsx', 
  /style=\{\{\s*padding:\s*"2px 6px",\s*borderRadius:\s*"4px",\s*fontSize:\s*"11px",\s*fontWeight:\s*"700",\s*background:\s*item\.sla\.includes\('BREACHED'\)\s*\?\s*"#FFEBEE"\s*:\s*item\.sla\.includes\('RISK'\)\s*\?\s*"#FFF3E0"\s*:\s*"#E8F5E9",\s*color:\s*item\.sla\.includes\('BREACHED'\)\s*\?\s*"#C62828"\s*:\s*item\.sla\.includes\('RISK'\)\s*\?\s*"#E65100"\s*:\s*"#2E7D32"\s*\}\}/g,
  `style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", background: item.sla.includes('BREACHED') ? "var(--danger-bg)" : item.sla.includes('RISK') ? "var(--warning-bg)" : "var(--success-bg)", color: item.sla.includes('BREACHED') ? "var(--danger-text)" : item.sla.includes('RISK') ? "var(--warning-text)" : "var(--success-text)", display: "flex", alignItems: "center", gap: "4px" }}`
);

// Add Clock icon import to CriticalAlerts
replaceInFile('pages/vet/CriticalAlerts.jsx', 
  /import \{ ShieldAlert, Activity, Filter, MapPin, ChevronRight, ActivitySquare, Shield \} from 'lucide-react';/,
  `import { ShieldAlert, Activity, Filter, MapPin, ChevronRight, ActivitySquare, Shield, Clock } from 'lucide-react';`
);

// Update the rendering of the SLA tag
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /<span style=\{\{(.*?)\}\}>\{item\.sla\}<\/span>/g,
  `<span style={{$1}}><Clock size={12} /> {item.sla}</span>`
);

// CaseWorkspace.jsx - Priority Score numeral color
replaceAllInFile('pages/vet/CaseWorkspace.jsx',
  /<div style=\{\{\s*fontSize:\s*"32px",\s*fontWeight:\s*"800",\s*color:\s*"#2E7D32",\s*lineHeight:\s*1\s*\}\}>\{caseData\.sentinel\?.priority_score \|\| 0\}<\/div>/g,
  `<div style={{ fontSize: "32px", fontWeight: "800", color: (caseData.sentinel?.priority_score >= 80) ? 'var(--danger-text)' : (caseData.sentinel?.priority_score >= 50) ? 'var(--warning-text)' : 'var(--text-secondary)', lineHeight: 1 }}>{caseData.sentinel?.priority_score || 0}</div>`
);

// Call Farmer button stray blue removal in CaseWorkspace
replaceAllInFile('pages/vet/CaseWorkspace.jsx',
  /<button onClick=\{\(\) => setSimulateCall\(true\)\}\s*style=\{\{\s*width:\s*"100%",\s*padding:\s*"12px",\s*background:\s*"#1565C0",\s*color:\s*"white",\s*border:\s*"none",\s*borderRadius:\s*"8px",\s*fontWeight:\s*"700",\s*cursor:\s*"pointer",\s*display:\s*"flex",\s*justifyContent:\s*"center",\s*alignItems:\s*"center",\s*gap:\s*"8px"\s*\}\}>/g,
  `<button onClick={() => setSimulateCall(true)} style={{ width: "100%", padding: "12px", background: "var(--brand-600)", color: "white", border: "none", borderRadius: "var(--radius-btn)", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>`
);

// Species donut categorical palette and legend
// In DistrictDashboard.jsx, COLORS needs to be updated.
replaceAllInFile('pages/vet/DistrictDashboard.jsx',
  /const COLORS = \['#ef4444', '#f97316', '#22c55e'\];/g,
  `const COLORS = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)'];`
);

// 2.3 Time bugs
// Dashboard.jsx greeting and format
replaceInFile('pages/vet/Dashboard.jsx',
  /const greeting = new Date\(\)\.getHours\(\) < 12 \? 'GOOD MORNING' : new Date\(\)\.getHours\(\) < 17 \? 'GOOD AFTERNOON' : 'GOOD EVENING';/g,
  `import { getGreeting } from '../../utils/time.js';\n  const greeting = getGreeting().toUpperCase();`
);

replaceInFile('pages/farmer/Dashboard.jsx',
  /const greeting = TRANSLATIONS\[lang\]\[new Date\(\)\.getHours\(\) < 12 \? 'morning' : new Date\(\)\.getHours\(\) < 17 \? 'afternoon' : 'evening'\];/g,
  `import { getKolkataTime } from '../../utils/time.js';\n  const hr = getKolkataTime().getHours();\n  const greeting = TRANSLATIONS[lang][hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening'];`
);

replaceAllInFile('pages/vet/DistrictDashboard.jsx',
  /const timer = setInterval\(\(\) => setTime\(new Date\(\)\.toLocaleTimeString\(\)\), 1000\);/g,
  `const timer = setInterval(() => {
      setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date()));
    }, 1000);`
);

// Format times globally where `toLocaleString()` or raw dates were used
// (CriticalAlerts, CaseWorkspace, Passbook, etc.)
// We will replace basic date strings with formatKolkataTime
replaceInFile('pages/vet/CaseWorkspace.jsx',
  /import \{ ShieldAlert/g,
  `import { formatKolkataTime } from '../../utils/time.js';\nimport { ShieldAlert`
);
replaceAllInFile('pages/vet/CaseWorkspace.jsx',
  /\{new Date\(caseData\.started_at\)\.toLocaleString\(\)\}/g,
  `{formatKolkataTime(caseData.started_at)}`
);

replaceInFile('pages/vet/CriticalAlerts.jsx',
  /import \{ ShieldAlert/g,
  `import { formatKolkataTime } from '../../utils/time.js';\nimport { ShieldAlert`
);
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /\{new Date\(item\.started_at \|\| item\.detected_at\)\.toLocaleString\(\)\}/g,
  `{formatKolkataTime(item.started_at || item.detected_at)}`
);

// 2.4 Copy: Pluralisation & Abbreviations
replaceAllInFile('pages/farmer/VaccinationPassbook.jsx',
  /2 vaccinations overdue/g,
  `2 vaccination(s) overdue` // Fix simple plurals
);

// Abbreviations: BQ = Black Quarter
replaceAllInFile('pages/vet/CaseWorkspace.jsx',
  /caseData\.syndrome/g,
  `(caseData.syndrome === 'BQ' ? 'Black Quarter (BQ)' : caseData.syndrome === 'FMD' ? 'Foot and Mouth Disease (FMD)' : caseData.syndrome === 'PPR' ? 'Peste des Petits Ruminants (PPR)' : caseData.syndrome)`
);

// 2.6 Advisory: Poster + Watch video button
const videoHTML = `<div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "#000", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!showVideo ? (
            <>
              <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=600&q=80" alt="Livestock Health" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              <button onClick={() => setShowVideo(true)} style={{ zIndex: 1, padding: "12px 24px", background: "var(--brand-600)", color: "white", border: "none", borderRadius: "var(--radius-btn)", fontWeight: "600", cursor: "pointer" }}>Watch Video</button>
            </>
          ) : (
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Advisory Video" frameBorder="0" allowFullScreen></iframe>
            {/* TODO: Supply an India-relevant video URL for livestock advisory */}
          )}
        </div>`;

replaceInFile('pages/farmer/Advisory.jsx',
  /const \[lang, setLang\] = useState\('en'\);/g,
  `const [lang, setLang] = useState('en');\n  const [showVideo, setShowVideo] = useState(false);`
);

replaceAllInFile('pages/farmer/Advisory.jsx',
  /<iframe width="100%" height="200" src=".*?" title="YouTube video player" frameBorder="0" allow=".*?" allowFullScreen style=\{\{ borderRadius: "12px", marginBottom: "16px" \}\}><\/iframe>/g,
  videoHTML
);


console.log("Phase 2 patch script completed.");
