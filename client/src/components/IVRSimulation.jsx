import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, CheckCircle, X, ShieldAlert } from 'lucide-react';
import { apiPost } from '../api/client.js';

export default function IVRSimulation({ onClose, isMissedCall = false }) {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const logsEndRef = useRef(null);
  
  const addLog = (msg, isUser = false) => {
    setLogs(prev => [...prev, { msg, isUser }]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    let timers = [];
    if (step === 0) {
      if (isMissedCall) {
        addLog("SIMULATED MISSED-CALL CALLBACK");
        timers.push(setTimeout(() => addLog("Registering missed call from +91-9876543210..."), 800));
        timers.push(setTimeout(() => addLog("Farmer profile found: Raju Kumar, Malegaon, Nashik, Maharashtra."), 1500));
        timers.push(setTimeout(() => addLog("Automatic Callback Initiated..."), 2500));
        timers.push(setTimeout(() => { addLog("Connected."); setStep(1); }, 4000));
      } else {
        addLog("Dialing 1800-XXX-XXXX...");
        timers.push(setTimeout(() => addLog("Connecting..."), 800));
        timers.push(setTimeout(() => { addLog("Connected."); setStep(1); }, 2000));
      }
    } else if (step === 1) {
      timers.push(setTimeout(() => addLog("Welcome to Pashuraksha Animal Health Helpline. For Marathi, press 1. For Hindi, press 2. For English, press 3."), 500));
    } else if (step === 2) {
      if (isMissedCall) {
        timers.push(setTimeout(() => addLog("Namaskar Raju Kumar. Press 1 to Report Sick Animal. Press 2 to Report Animal Death. Press 3 for Vaccination Info. Press 4 for Emergency Veterinary Assistance."), 500));
      } else {
        timers.push(setTimeout(() => addLog("Press 1 to Report Sick Animal. Press 2 to Report Animal Death. Press 3 for Vaccination Info. Press 4 for Emergency Veterinary Assistance."), 500));
      }
    } else if (step === 3) {
      timers.push(setTimeout(() => addLog("Select Species: 1 for Cattle, 2 for Buffalo, 3 for Goat, 4 for Sheep, 5 for Poultry."), 500));
    } else if (step === 4) {
      timers.push(setTimeout(() => addLog("Select Symptoms: 1 for Fever, 2 for Lameness, 3 for Blisters/Mouth Lesions, 4 for Breathing Difficulty, 5 for Diarrhea."), 500));
    } else if (step === 5) {
      timers.push(setTimeout(() => addLog("Enter number of animals affected using the keypad, then press #."), 500));
    } else if (step === 6) {
      timers.push(setTimeout(() => addLog("Enter number of deaths, then press #."), 500));
    } else if (step === 7) {
      if (!isMissedCall) {
        timers.push(setTimeout(() => addLog("Location not registered. Press 1 for Malegaon, 2 for Satana, 3 for Baglan."), 500));
      } else {
        timers.push(setTimeout(() => setStep(8), 500));
      }
    } else if (step === 8) {
      timers.push(setTimeout(() => addLog("You reported fever and lameness in 5 cattle in Malegaon, Nashik, Maharashtra. Press 1 to confirm. Press 2 to edit."), 500));
    }

    return () => timers.forEach(clearTimeout);
  }, [step, isMissedCall]);

  const handleKeypad = async (key) => {
    if (processing) return;
    addLog(`[Pressed ${key}]`, true);

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (key === '4') {
        setStep(99); // Emergency
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      if (key === '#') setStep(6);
    } else if (step === 6) {
      if (key === '#') setStep(7);
    } else if (step === 7) {
      setStep(8);
    } else if (step === 8) {
      if (key === '1') {
        setProcessing(true);
        addLog("Processing report into Sentinel Surveillance Engine...");
        try {
          const res = await apiPost('/reports', {
            source: 'IVR',
            species: 'Cattle',
            syndrome: 'FMD',
            symptoms: 'Fever, Lameness',
            mortality_count: 0,
            village: 'Malegaon',
            district: 'Nashik',
            captured_at: new Date().toISOString()
          });
          setReportId(res.report.id || 'PR-IVR-1042');
          addLog("REPORT CREATED. Report ID: PR-IVR-1042.");
          addLog("A preliminary risk assessment has been forwarded to the local veterinary officer.");
        } catch(e) {
          addLog("REPORT CREATED (Offline Simulation).");
          setReportId('PR-IVR-OFFLINE');
        }
        setProcessing(false);
      } else if (key === '2') {
        setStep(3);
      }
    } else if (step === 99) {
      setProcessing(true);
      addLog("EMERGENCY REQUEST PRIORITIZED.");
      timers = [
        setTimeout(() => addLog("Creating Emergency Ticket..."), 1000),
        setTimeout(() => addLog("Ticket created and routed to Nashik District Rapid Response Team."), 2500)
      ];
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#F5F5F5", width: "100%", maxWidth: "400px", height: "85vh", borderRadius: "24px", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", border: "4px solid #333" }}>
        
        {/* Header */}
        <div style={{ background: "#1B5E20", color: "white", padding: "16px", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", right: "16px", top: "16px", background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={24} /></button>
          <PhoneCall size={24} style={{ marginBottom: "8px" }} />
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Pashuraksha Helpline</h2>
          <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>SIMULATED IVR FOR SIH PROTOTYPE</div>
        </div>

        {/* Screen */}
        <div style={{ flex: 1, background: "white", margin: "16px", borderRadius: "12px", padding: "12px", overflowY: "auto", border: "1px solid #E0E0E0", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {logs.map((l, i) => (
            <div key={i} style={{ alignSelf: l.isUser ? "flex-end" : "flex-start", background: l.isUser ? "#E8F5E9" : "#F5F5F5", color: l.isUser ? "#1B5E20" : "#333", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", maxWidth: "85%", border: l.isUser ? "1px solid #C8E6C9" : "1px solid #E0E0E0" }}>
              {l.msg}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Keypad */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
              <button 
                key={key} 
                onClick={() => handleKeypad(key.toString())}
                disabled={processing || reportId}
                style={{
                  padding: "16px", background: "white", border: "1px solid #E0E0E0", borderRadius: "12px", fontSize: "20px", fontWeight: "600", color: "#333", cursor: (processing || reportId) ? "not-allowed" : "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              >
                {key}
              </button>
            ))}
          </div>
          
          <button onClick={onClose} style={{ width: "100%", padding: "16px", background: "#D32F2F", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <Phone size={20} /> End Call
          </button>
        </div>

      </div>
    </div>
  );
}
