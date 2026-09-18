const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import IVRSimulation')) {
    code = code.replace(
      'import { useSyncContext } from "../../contexts/SyncContext.jsx";',
      'import { useSyncContext } from "../../contexts/SyncContext.jsx";\nimport IVRSimulation from "../../components/IVRSimulation.jsx";'
    );
    
    code = code.replace(
      'const [lang, setLang] = useState("en");',
      'const [lang, setLang] = useState("en");\n  const [showIVR, setShowIVR] = useState(false);'
    );
    
    const ivrCard = `
        <div style={{ background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)", borderRadius: "16px", padding: "20px", color: "white", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(46,125,50,0.2)" }}>
           <div>
             <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "8px" }}>
                <Phone size={20} /> Pashuraksha Helpline
             </div>
             <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>No app? No problem. Call our toll-free number to report issues via feature phone.</p>
           </div>
           <button onClick={() => setShowIVR(true)} style={{ background: "white", color: "#2E7D32", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", marginLeft: "16px" }}>
             Try Demo
           </button>
        </div>
        {showIVR && <IVRSimulation onClose={() => setShowIVR(false)} />}
    `;
    
    code = code.replace(
      '<div className="dashboard-grid">',
      ivrCard + '\n        <div className="dashboard-grid">'
    );
    
    fs.writeFileSync(file, code, 'utf8');
    console.log("Patched Farmer Dashboard");
}
