import { useState, useEffect } from 'react';
import { Phone, Mic, Hash, CheckCircle, X, Loader } from 'lucide-react';
import { apiPost } from '../api/client.js';

export default function IVRSimulation({ onClose }) {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [reportId, setReportId] = useState(null);
  
  const addLog = (msg, isUser = false) => {
    setLogs(prev => [...prev, { msg, isUser }]);
  };

  useEffect(() => {
    let timers = [];
    if (step === 0) {
      addLog("Dialing 1800-PASHU-HELP...");
      timers.push(setTimeout(() => {
        addLog("Connected.", false);
        setStep(1);
      }, 1500));
    } else if (step === 1) {
      timers.push(setTimeout(() => addLog("Pashuraksha Animal Health Helpline. For English, press 1. Hindi, press 2. Gujarati, press 3.", false), 1000));
    } else if (step === 2) {
      timers.push(setTimeout(() => addLog("Press 1 to Report a sick animal. Press 2 for Vaccination information. Press 3 for Emergency.", false), 500));
    } else if (step === 3) {
      timers.push(setTimeout(() => addLog("Select Species. 1 for Cattle, 2 for Buffalo, 3 for Goat, 4 for Sheep.", false), 500));
    } else if (step === 4) {
      timers.push(setTimeout(() => addLog("Select Symptoms. 1 for Fever, 2 for Lameness, 3 for Blisters.", false), 500));
    } else if (step === 5) {
      timers.push(setTimeout(() => addLog("Enter number of affected animals, followed by the hash key.", false), 500));
    } else if (step === 6) {
      timers.push(setTimeout(() => addLog("Enter PIN code or say your village name.", false), 500));
    } else if (step === 7) {
      timers.push(setTimeout(() => addLog("You reported Fever and Blisters in 2 Cattle in Gondal. Press 1 to confirm, 2 to edit.", false), 1000));
    } else if (step === 8) {
      addLog("Generating report...", false);
      apiPost("/reports", {
        species: "Cattle",
        syndrome: "FMD",
        symptoms: "Fever, Blisters/Ulcers",
        mortalityCount: 0,
        village: "Gondal",
        district: "Rajkot",
        vaccination_status: "unknown",
        source: "IVR"
      }).then(res => {
         setReportId(res.id || "PR-IVR-SUCCESS");
         addLog(`Report successfully created. Your Report ID is ${res.id}.`, false);
         addLog("A veterinarian has been notified. Thank you for calling.", false);
         setTimeout(() => setStep(9), 3000);
      }).catch(err => {
         addLog("Error creating report: " + err.message, false);
      });
    }

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleInput = (val) => {
    addLog(`[Pressed ${val}]`, true);
    setStep(s => s + 1);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#222", width: "100%", maxWidth: "350px", borderRadius: "30px", overflow: "hidden", border: "8px solid #111", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: "600px" }}>
        {/* Phone Header */}
        <div style={{ background: "#333", padding: "20px", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", background: "transparent", border: "none", color: "#999", cursor: "pointer" }}>
            <X size={20} />
          </button>
          <div style={{ color: "#fff", fontSize: "12px", opacity: 0.6, marginBottom: "4px" }}>PASHURAKSHA HELPLINE</div>
          <div style={{ color: "#F57C00", fontSize: "10px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>SIMULATED FOR SIH PROTOTYPE</div>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: "600" }}>1800-XXX-XXXX</div>
          <div style={{ color: step > 0 && step < 9 ? "#4CAF50" : "#999", fontSize: "14px", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {step === 0 ? <Loader size={14} className="spin-anim" /> : (step < 9 ? <Phone size={14} /> : <CheckCircle size={14} />)}
            {step === 0 ? "Dialing..." : (step < 9 ? "Connected 00:12" : "Call Ended")}
          </div>
        </div>

        {/* Call Screen / Logs */}
        <div style={{ flex: 1, background: "#1a1a1a", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ alignSelf: log.isUser ? "flex-end" : "flex-start", background: log.isUser ? "#2E7D32" : "#333", color: "#fff", padding: "10px 14px", borderRadius: "16px", maxWidth: "80%", fontSize: "14px", lineHeight: "1.4" }}>
              {log.msg}
            </div>
          ))}
          {step === 8 && <div style={{ alignSelf: "flex-start", color: "#4CAF50", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}><Loader size={14} className="spin-anim"/> Processing...</div>}
        </div>

        {/* Keypad */}
        <div style={{ background: "#222", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", borderTop: "1px solid #333" }}>
          {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
            <button key={key} onClick={() => handleInput(key)} disabled={step === 0 || step >= 8} style={{ background: "#333", border: "none", borderRadius: "50%", width: "60px", height: "60px", margin: "0 auto", color: "#fff", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: step === 0 || step >= 8 ? "default" : "pointer", opacity: step === 0 || step >= 8 ? 0.5 : 1 }}>
              {key}
            </button>
          ))}
        </div>
        
        {/* End Call */}
        <div style={{ background: "#222", padding: "10px 20px 30px 20px", display: "flex", justifyContent: "center" }}>
          <button onClick={onClose} style={{ background: "#d32f2f", border: "none", borderRadius: "50%", width: "60px", height: "60px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 10px rgba(211,47,47,0.4)" }}>
            <Phone size={28} style={{ transform: "rotate(135deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
