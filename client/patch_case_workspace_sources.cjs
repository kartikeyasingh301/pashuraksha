const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('const sourceString')) {
    code = code.replace(
        "const c = data.case;",
        `const c = data.case;
  const sourceString = data.reports?.[0]?.source || 'APP';
  const hasVoice = sourceString === 'VOICE';
  const hasIVR = sourceString === 'IVR';
  const [callState, setCallState] = useState(0); // 0=none, 1=dialing, 2=calling, 3=connected, 4=logged`
    );
}

if (!code.includes('lucide-react')) {
    code = code.replace(
        "import { ShieldAlert",
        "import { Mic, Play, Phone, ShieldAlert"
    );
}

const callLogic = `
  const handleCall = () => {
    if(callState > 0) return;
    setCallState(1);
    setTimeout(() => setCallState(2), 1500);
    setTimeout(() => setCallState(3), 4000);
    setTimeout(() => setCallState(4), 8000);
  };
`;

if (!code.includes('handleCall')) {
    code = code.replace(
        "const isCrit = c.sentinel?.risk_level === 'CRITICAL';",
        `const isCrit = c.sentinel?.risk_level === 'CRITICAL';\n  ${callLogic}`
    );
}

const callUI = `
        {/* CALL FARMER LOGIC */}
        {(hasVoice || hasIVR) && (
          <div style={{ ...cardStyle, background: "#E3F2FD", borderColor: "#BBDEFB" }}>
             <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#1565C0", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
               <Phone size={16} /> Contact Originator
             </h3>
             <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
               <button onClick={handleCall} disabled={callState > 0} style={{ padding: "12px 24px", background: callState === 4 ? "#2E7D32" : "#1565C0", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: callState > 0 ? "not-allowed" : "pointer" }}>
                 {callState === 0 ? "CALL FARMER" : callState === 1 ? "Dialing..." : callState === 2 ? "Calling..." : callState === 3 ? "Connected" : "Call Logged"}
               </button>
               {callState === 4 && <span style={{ fontSize: "12px", color: "#2E7D32", fontWeight: "700" }}><CheckCircle size={14} style={{ verticalAlign: "middle", marginRight: "4px" }}/> Added to timeline</span>}
             </div>
          </div>
        )}
`;

if (!code.includes('CALL FARMER LOGIC')) {
    code = code.replace(
        "{/* WHY FLAGGED */}",
        `${callUI}\n\n        {/* WHY FLAGGED */}`
    );
}

fs.writeFileSync(file, code, 'utf8');
console.log("CaseWorkspace sources and call logic patched!");
