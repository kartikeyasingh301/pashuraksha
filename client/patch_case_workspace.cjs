const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Phone, Mic, Play')) {
    code = code.replace(
      'import { ShieldAlert, MapPin, Activity, CheckCircle, Clock, ChevronRight, FileText, FlaskConical, Users, Crosshair } from "lucide-react";',
      'import { ShieldAlert, MapPin, Activity, CheckCircle, Clock, ChevronRight, FileText, FlaskConical, Users, Crosshair, Phone, Mic, Play } from "lucide-react";'
    );
    
    // Add call state
    code = code.replace(
      'const [loading, setLoading] = useState(true);',
      'const [loading, setLoading] = useState(true);\n  const [callState, setCallState] = useState(null);'
    );
    
    // Add Call Simulation Function
    code = code.replace(
      'const isCrit = c.sentinel?.risk_level === "CRITICAL";',
      `const isCrit = c.sentinel?.risk_level === 'CRITICAL';
  
  const handleCallFarmer = () => {
     setCallState('calling');
     setTimeout(() => setCallState('connected'), 2000);
     setTimeout(() => setCallState('logged'), 6000);
  };
  
  const hasVoice = data.reports?.some(r => r.source === 'VOICE');
  const hasIVR = data.reports?.some(r => r.source === 'IVR');
  const sourceString = [hasVoice && 'VOICE', hasIVR && 'IVR', 'APP'].filter(Boolean).join(' | ');
      `
    );
    
    const additionalStats = `
             <div style={{ background: "white", padding: "8px 12px", borderRadius: "8px", flex: 1, border: "1px solid rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>SOURCES</div>
               <div style={{ fontSize: "12px", fontWeight: "700", color: "#1565C0" }}>{sourceString}</div>
             </div>
    `;
    code = code.replace(
      '<div style={{ fontSize: "16px", fontWeight: "700", color: "#D32F2F" }}>{data.reports?.length || 2}</div>\n             </div>',
      '<div style={{ fontSize: "16px", fontWeight: "700", color: "#D32F2F" }}>{data.reports?.length || 2}</div>\n             </div>' + additionalStats
    );
    
    const voiceEvidenceBlock = `
        {/* VOICE EVIDENCE (If source is Voice) */}
        {hasVoice && (
          <div style={{ ...cardStyle, background: "#F3E5F5", borderColor: "#E1BEE7" }}>
             <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#4A148C", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
               <Mic size={16} /> Original Voice Report
             </h3>
             <div style={{ background: "white", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <button style={{ background: "#7B1FA2", border: "none", color: "white", width: "40px", height: "40px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Play size={16} fill="white" /></button>
                <div style={{ flex: 1 }}>
                  <div style={{ background: "#eee", height: "4px", borderRadius: "2px", width: "100%", position: "relative" }}>
                     <div style={{ background: "#7B1FA2", height: "4px", borderRadius: "2px", width: "30%" }}></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666", marginTop: "4px" }}>
                     <span>00:04</span><span>00:14</span>
                  </div>
                </div>
             </div>
             <div style={{ background: "white", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#333", border: "1px solid rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: "11px", color: "#666", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase" }}>Transcription</div>
               "My cow has fever and blisters. It is having difficulty walking. Two other cows also look sick."
             </div>
          </div>
        )}
    `;
    code = code.replace(
      '{/* WHY FLAGGED */}',
      voiceEvidenceBlock + '\n        {/* WHY FLAGGED */}'
    );
    
    const actionButtons = `
        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
           <button style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#2E7D32", color: "white", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}>
             <CheckCircle size={18} /> ACKNOWLEDGE
           </button>
           <button onClick={handleCallFarmer} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: callState ? "#E8F5E9" : "#1976D2", color: callState ? "#2E7D32" : "white", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}>
             <Phone size={18} /> {callState === 'calling' ? 'Dialing...' : callState === 'connected' ? 'Connected 00:02' : callState === 'logged' ? 'Call Logged' : 'CALL FARMER'}
           </button>
        </div>
    `;
    
    code = code.replace(
      '{/* RECOMMENDED ACTIONS */}',
      actionButtons + '\n\n        {/* RECOMMENDED ACTIONS */}'
    );

    fs.writeFileSync(file, code, 'utf8');
    console.log("Patched CaseWorkspace.jsx");
}
