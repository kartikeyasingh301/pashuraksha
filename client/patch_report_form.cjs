const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Add Mic, Square, Play, Pause to lucide imports
if (!code.includes('Mic,')) {
    code = code.replace(
      'import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send, Languages, ShieldAlert, Activity, Info } from "lucide-react";',
      'import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send, Languages, ShieldAlert, Activity, Info, Mic, Square } from "lucide-react";'
    );
}

// 2. Inject Voice Mode state inside the component
if (!code.includes('const [activeTab, setActiveTab]')) {
    code = code.replace(
      'const [submitting, setSubmitting] = useState(false);',
      `const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");
  const [voiceState, setVoiceState] = useState("idle"); // idle, recording, processing, verify
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Voice simulation effect
  useCallback(() => {}, []);`
    );
}

// 3. Add Voice logic methods
if (!code.includes('handleStartRecording')) {
    code = code.replace(
      'async function handleSubmit(e) {',
      `
  let timerInterval;
  const handleStartRecording = () => {
    setVoiceState("recording");
    setRecordingTime(0);
    timerInterval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    // simulate stopping after 5 sec
    setTimeout(() => {
       clearInterval(timerInterval);
       handleStopRecording();
    }, 5000);
  };

  const handleStopRecording = () => {
    setVoiceState("processing");
    setTimeout(() => {
       // simulate extracted info
       setForm(prev => ({
           ...prev,
           species: "Cattle",
           symptoms: ["Fever", "Blisters/Ulcers", "Lameness"],
           mortalityCount: "0",
           notes: "My cow has fever and blisters. It is having difficulty walking. (Extracted via Voice)",
           source: "VOICE"
       }));
       setVoiceState("verify");
    }, 2000);
  };
  
  async function handleSubmit(e) {`
    );
}

// 4. Update buildReport to include source
if (!code.includes('source: form.source || "APP"')) {
    code = code.replace(
      'notes: form.notes.trim() || null,',
      'notes: form.notes.trim() || null,\n      source: form.source || (activeTab === "voice" ? "VOICE" : "APP"),'
    );
}

// 5. Replace <form> rendering to wrap with Tabs
const tabsUI = `
        <div style={{ display: "flex", background: "#f5f5f5", padding: "4px", borderRadius: "8px", marginBottom: "20px" }}>
           <button onClick={() => setActiveTab("standard")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", background: activeTab === "standard" ? "white" : "transparent", fontWeight: activeTab === "standard" ? "700" : "500", color: activeTab === "standard" ? "#2E7D32" : "#666", boxShadow: activeTab === "standard" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer" }}>📝 Standard Report</button>
           <button onClick={() => setActiveTab("voice")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", background: activeTab === "voice" ? "white" : "transparent", fontWeight: activeTab === "voice" ? "700" : "500", color: activeTab === "voice" ? "#2E7D32" : "#666", boxShadow: activeTab === "voice" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer" }}>🎙 Speak Your Problem</button>
        </div>

        {activeTab === "voice" && voiceState !== "verify" && (
           <div style={{ background: "white", borderRadius: "12px", padding: "30px 20px", textAlign: "center", border: "1px solid #eee", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {voiceState === "idle" && (
                 <>
                    <div style={{ background: "#E8F5E9", width: "80px", height: "80px", borderRadius: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: "20px" }} onClick={handleStartRecording}>
                       <Mic size={40} color="#2E7D32" />
                    </div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Voice Report</h3>
                    <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Tap the microphone and describe the animal's symptoms, species, and your location.</p>
                 </>
              )}
              {voiceState === "recording" && (
                 <>
                    <div style={{ background: "#ffebee", width: "80px", height: "80px", borderRadius: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: "20px", animation: "pulse 1.5s infinite" }}>
                       <Square size={30} color="#d32f2f" />
                    </div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#d32f2f" }}>Recording... 00:0{recordingTime}</h3>
                    <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Speak clearly into your microphone.</p>
                    <style>{'@keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(211, 47, 47, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); } }'}</style>
                 </>
              )}
              {voiceState === "processing" && (
                 <>
                    <Loader size={40} color="#2E7D32" className="spin-anim" style={{ marginBottom: "20px" }} />
                    <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Transcription in progress</h3>
                    <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Extracting structured information from your report...</p>
                 </>
              )}
           </div>
        )}

        {(activeTab === "standard" || voiceState === "verify") && (
           <>
           {voiceState === "verify" && (
             <div style={{ background: "#E3F2FD", border: "1px solid #90CAF9", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1565C0", fontWeight: "700", marginBottom: "12px" }}>
                   <Info size={18} /> Information Extracted
                </div>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#333", fontStyle: "italic", background: "white", padding: "10px", borderRadius: "4px" }}>
                   "My cow has fever and blisters. It is having difficulty walking."
                </p>
                <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>Please <strong>verify and confirm</strong> the extracted information below before submitting.</p>
             </div>
           )}
           <form onSubmit={handleSubmit} className="report-form" noValidate>`;

if (!code.includes('📝 Standard Report')) {
    code = code.replace('<form onSubmit={handleSubmit} className="report-form" noValidate>', tabsUI);
    // We need to close the <> tag that we opened for standard/verify
    code = code.replace('</form>', '</form>\n           </>\n        )');
}

fs.writeFileSync(file, code, 'utf8');
console.log("Patched ReportForm.jsx");
