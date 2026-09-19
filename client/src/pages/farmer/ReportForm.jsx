import { useState, useCallback } from "react";
import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send, Languages, ShieldAlert, Activity, Info, Mic, Square, FileText } from "lucide-react";
import Layout from "../../components/Layout.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useSyncContext } from "../../contexts/SyncContext.jsx";
import { useLocation } from "../../hooks/useLocation.js";
import { apiPost } from "../../api/client.js";
import { addToQueue } from "../../sync/syncManager.js";

const SPECIES_LIST = ["Cattle", "Buffalo", "Sheep", "Goat", "Pig", "Poultry", "Dog", "Other"];
const SYNDROME_LIST = ["FMD", "PPR", "BQ", "Anthrax", "Rabies", "Brucellosis", "Theileriosis", "Lumpy Skin Disease", "HPAI", "Other"];
const SYMPTOM_LIST = ["Fever", "Lameness", "Blisters/Ulcers", "Respiratory distress", "Neurological signs", "Diarrhea", "Sudden death", "Abortion", "Swelling", "Loss of appetite", "Excessive Salivation", "Nasal Discharge", "Skin Lesions", "Coughing"];
const VACCINE_LIST = ["Vaccinated", "Unvaccinated", "Unknown"];

const TRANSLATIONS = {
  en: {
    title: "Report Health Issue",
    offlineMsg: "You are offline. Report will be saved locally and synced when you reconnect.",
    successOnline: "Report submitted! ID:",
    successOffline: "Saved offline — will sync when connected.",
    successError: "Saved offline (error:",
    reqSpecies: "Species is required",
    reqSyndrome: "Syndrome/condition is required",
    reqVillage: "Village is required",
    lblSpecies: "Species *",
    selSpecies: "-- Select species --",
    lblSyndrome: "Syndrome / Condition *",
    selSyndrome: "-- Select condition --",
    lblSymptoms: "Symptoms",
    lblMortality: "Mortality Count",
    lblAnimalId: "Animal / Herd ID (optional)",
    phAnimalId: "e.g. TAG-001",
    lblVillage: "Village *",
    phVillage: "Enter your village name",
    lblGps: "GPS Location",
    btnLocLoading: "Getting location...",
    btnLocGet: "Get GPS Location",
    lblVaccine: "Vaccination Status",
    lblNotes: "Additional Notes (optional)",
    phNotes: "Any additional observations...",
    btnSubmitting: "Submitting...",
    btnSubmit: "Submit Report",
    btnSaveOffline: "Save Offline",
    species: { "Cattle":"Cattle", "Buffalo":"Buffalo", "Sheep":"Sheep", "Goat":"Goat", "Pig":"Pig", "Poultry":"Poultry", "Dog":"Dog", "Other":"Other" },
    syndrome: { "FMD":"FMD", "PPR":"PPR", "BQ":"BQ", "Anthrax":"Anthrax", "Rabies":"Rabies", "Brucellosis":"Brucellosis", "Theileriosis":"Theileriosis", "Lumpy Skin Disease":"Lumpy Skin Disease", "HPAI":"HPAI", "Other":"Other" },
    symptoms: { "Fever":"Fever", "Lameness":"Lameness", "Blisters/Ulcers":"Blisters/Ulcers", "Respiratory distress":"Respiratory distress", "Neurological signs":"Neurological signs", "Diarrhea":"Diarrhea", "Sudden death":"Sudden death", "Abortion":"Abortion", "Swelling":"Swelling", "Loss of appetite":"Loss of appetite" },
    vaccine: { "Vaccinated":"Vaccinated", "Unvaccinated":"Unvaccinated", "Unknown":"Unknown" },
    lblHerdSize: "Herd Size",
    lblOnsetDate: "Onset Date",
    lblRecentMovement: "Recent animal movement?",
    lblNewAnimals: "New animals added recently?",
    lblContactHerds: "Contact with other herds?"
  },
  hi: {
    title: "स्वास्थ्य समस्या रिपोर्ट करें",
    offlineMsg: "आप ऑफ़लाइन हैं। रिपोर्ट स्थानीय रूप से सहेजी जाएगी और कनेक्ट होने पर सिंक हो जाएगी।",
    successOnline: "रिपोर्ट सबमिट हो गई! आईडी:",
    successOffline: "ऑफ़लाइन सहेजा गया — कनेक्ट होने पर सिंक होगा।",
    successError: "ऑफ़लाइन सहेजा गया (त्रुटि:",
    reqSpecies: "प्रजाति आवश्यक है",
    reqSyndrome: "सिंड्रोम/बीमारी आवश्यक है",
    reqVillage: "गांव आवश्यक है",
    lblSpecies: "प्रजाति *",
    selSpecies: "-- प्रजाति चुनें --",
    lblSyndrome: "सिंड्रोम / बीमारी *",
    selSyndrome: "-- बीमारी चुनें --",
    lblSymptoms: "लक्षण",
    lblMortality: "मृत्यु संख्या",
    lblAnimalId: "पशु / झुंड आईडी (वैकल्पिक)",
    phAnimalId: "जैसे TAG-001",
    lblVillage: "गाँव *",
    phVillage: "अपने गाँव का नाम दर्ज करें",
    lblGps: "GPS स्थान",
    btnLocLoading: "स्थान प्राप्त कर रहा है...",
    btnLocGet: "GPS स्थान प्राप्त करें",
    lblVaccine: "टीकाकरण की स्थिति",
    lblNotes: "अतिरिक्त जानकारी (वैकल्पिक)",
    phNotes: "कोई अतिरिक्त विवरण...",
    btnSubmitting: "सबमिट हो रहा है...",
    btnSubmit: "रिपोर्ट सबमिट करें",
    btnSaveOffline: "ऑफ़लाइन सहेजें",
    species: { "Cattle":"गाय", "Buffalo":"भैंस", "Sheep":"भेड़", "Goat":"बकरी", "Pig":"सुअर", "Poultry":"मुर्गी", "Dog":"कुत्ता", "Other":"अन्य" },
    syndrome: { "FMD":"मुंहपका-खुरपका", "PPR":"पीपीआर", "BQ":"लंगड़ा बुखार", "Anthrax":"एंथ्रेक्स", "Rabies":"रेबीज", "Brucellosis":"ब्रूसेलोसिस", "Theileriosis":"थाइलेरिया", "Lumpy Skin Disease":"लंपी वायरस", "HPAI":"बर्ड फ्लू", "Other":"अन्य" },
    symptoms: { "Fever":"बुखार", "Lameness":"लंगड़ापन", "Blisters/Ulcers":"छाले/अल्सर", "Respiratory distress":"सांस लेने में तकलीफ", "Neurological signs":"तंत्रीय लक्षण", "Diarrhea":"दस्त", "Sudden death":"अचानक मौत", "Abortion":"गर्भपात", "Swelling":"सूजन", "Loss of appetite":"भूख न लगना" },
    vaccine: { "Vaccinated":"टीकाकृत", "Unvaccinated":"टीका नहीं लगा", "Unknown":"अज्ञात" }
  },
  mr: {
    title: "आरोग्य समस्येची नोंद करा",
    offlineMsg: "तुम्ही ऑफलाइन आहात. अहवाल जतन केला जाईल आणि कनेक्ट झाल्यावर सिंक होईल.",
    successOnline: "अहवाल सबमिट केला! आयडी:",
    successOffline: "ऑफलाइन जतन केले — कनेक्ट झाल्यावर सिंक होईल.",
    successError: "ऑफलाइन जतन केले (त्रुटी:",
    reqSpecies: "प्रजाती आवश्यक आहे",
    reqSyndrome: "सिंड्रोम/आजारी स्थिती आवश्यक आहे",
    reqVillage: "गाव आवश्यक आहे",
    lblSpecies: "प्रजाती *",
    selSpecies: "-- प्रजाती निवडा --",
    lblSyndrome: "सिंड्रोम / स्थिती *",
    selSyndrome: "-- स्थिती निवडा --",
    lblSymptoms: "लक्षणे",
    lblMortality: "मृत्यू संख्या",
    lblAnimalId: "प्राणी / कळप आयडी (पर्यायी)",
    phAnimalId: "उदा. TAG-001",
    lblVillage: "गाव *",
    phVillage: "तुमच्या गावाचे नाव टाका",
    lblGps: "GPS स्थान",
    btnLocLoading: "स्थान मिळवत आहे...",
    btnLocGet: "GPS स्थान मिळवा",
    lblVaccine: "लसीकरणाची स्थिती",
    lblNotes: "अतिरिक्त माहिती (पर्यायी)",
    phNotes: "कोणतेही अतिरिक्त तपशील...",
    btnSubmitting: "सबमिट करत आहे...",
    btnSubmit: "अहवाल सबमिट करा",
    btnSaveOffline: "ऑफलाइन जतन करा",
    species: { "Cattle":"गाय", "Buffalo":"म्हैस", "Sheep":"मेंढी", "Goat":"शेळी", "Pig":"डुक्कर", "Poultry":"कोंबडी", "Dog":"कुत्रा", "Other":"इतर" },
    syndrome: { "FMD":"लाळ्या खुरकूत", "PPR":"पीपीआर", "BQ":"घटसर्प", "Anthrax":"अँथ्रॅक्स", "Rabies":"रेबीज", "Brucellosis":"ब्रूसेलोसिस", "Theileriosis":"थायलेरियोसिस", "Lumpy Skin Disease":"लम्पी रोग", "HPAI":"बर्ड फ्लू", "Other":"इतर" },
    symptoms: { "Fever":"ताप", "Lameness":"लंगडणे", "Blisters/Ulcers":"फोड/व्रण", "Respiratory distress":"श्वास घेण्यास त्रास", "Neurological signs":"न्यूरोलॉजिकल लक्षणे", "Diarrhea":"जुलाब", "Sudden death":"अचानक मृत्यू", "Abortion":"गर्भपात", "Swelling":"सूज", "Loss of appetite":"भूक न लागणे" },
    vaccine: { "Vaccinated":"लसीकरण केलेले", "Unvaccinated":"लसीकरण न केलेले", "Unknown":"अज्ञात" }
  }
};

const initialForm = { species: "", syndrome: "", symptoms: [], mortalityCount: 0, animalId: "", village: "", vaccinationStatus: "Unknown", notes: "", herdSize: "", onsetDate: "", recentMovement: false, newAnimals: false, contactHerds: false };

export default function ReportForm() {
  const { user } = useAuth();
  const { isOnline, refresh } = useSyncContext();
  const { location, getLocation, loading: locLoading, error: locError } = useLocation();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");
  const [voiceState, setVoiceState] = useState("idle"); // idle, recording, processing, verify
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Voice simulation effect
  useCallback(() => {}, []);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState("en");

  const t = TRANSLATIONS[lang];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSymptomToggle(symptom) {
    setForm((prev) => {
      const current = prev.symptoms;
      if (current.includes(symptom)) return { ...prev, symptoms: current.filter((s) => s !== symptom) };
      return { ...prev, symptoms: [...current, symptom] };
    });
  }

  
  function runTriage(f) {
    const s = f.symptoms || [];
    let risk = "LOW"; let condition = "Under Review"; let actions = ["Isolate animal", "Observe for 24h"];
    if (s.includes("Sudden death")) { risk = "CRITICAL"; condition = "Suspected Anthrax"; actions = ["Do not open carcass", "Contact vet immediately", "Evacuate area"]; }
    else if ((f.species === "Cattle" || f.species === "Buffalo") && s.includes("Fever") && (s.includes("Lameness") || s.includes("Blisters/Ulcers") || s.includes("Excessive Salivation"))) { risk = "HIGH"; condition = "Suspected FMD"; actions = ["Isolate sick animals", "Stop animal movement", "Disinfect premises"]; }
    else if ((f.species === "Goat" || f.species === "Sheep") && s.includes("Fever") && s.includes("Diarrhea") && (s.includes("Respiratory distress") || s.includes("Nasal Discharge"))) { risk = "HIGH"; condition = "Suspected PPR"; actions = ["Isolate sick animals", "Provide hydration", "Stop grazing in common areas"]; }
    else if (f.species === "Cattle" && s.includes("Fever") && s.includes("Skin Lesions")) { risk = "HIGH"; condition = "Suspected Lumpy Skin Disease"; actions = ["Isolate sick animal", "Control flies/mosquitoes"]; }
    return { risk, condition, actions };
  }

  function validate() {
    const newErrors = {};
    if (!form.species) newErrors.species = t.reqSpecies;
    if (!form.syndrome) newErrors.syndrome = t.reqSyndrome;
    if (!form.village.trim()) newErrors.village = t.reqVillage;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const buildReport = useCallback(() => {
    const capturedAt = new Date().toISOString();
    const uid = user?.id || user?.username || "u";
    const localId = `${uid}_${Date.now()}_${form.species}_${form.village.trim()}`;
    return {
      localId, local_id: localId,
      captured_at: capturedAt, capturedAt,
      species: form.species,
      syndrome: form.syndrome,
      symptoms: form.symptoms,
      mortality_count: parseInt(form.mortalityCount) || 0,
      mortalityCount: parseInt(form.mortalityCount) || 0,
      herd_id: form.animalId.trim() || null,
      herd_size: parseInt(form.herdSize) || 0,
      onset_date: form.onsetDate || null,
      recent_movement: form.recentMovement,
      new_animals: form.newAnimals,
      contact_herds: form.contactHerds,
      animalId: form.animalId.trim() || null,
      village: form.village.trim(),
      latitude: location.lat, longitude: location.lng,
      lat: location.lat, lng: location.lng,
      vaccination_status: form.vaccinationStatus.toLowerCase(),
      vaccinationStatus: form.vaccinationStatus,
      notes: form.notes.trim() || null,
      source: form.source || (activeTab === "voice" ? "VOICE" : "APP"),
    };
  }, [form, location, user]);

  
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
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(null);
    const report = buildReport();
    if (isOnline) {
      try {
        const result = await apiPost("/reports", report);
        setSuccess({ type: "online", id: result.id || result.reportId || result.report?.id || "submitted", triage: runTriage(form) });
        setForm(initialForm);
        await refresh();
      } catch (err) {
        await addToQueue(report);
        await refresh();
        setSuccess({ type: "offline_fallback", message: err.message });
      }
    } else {
      try {
        await addToQueue(report);
        await refresh();
        setSuccess({ type: "offline", triage: runTriage(form) });
        setForm(initialForm);
      } catch (err) {
        setErrors({ submit: "Failed to save offline: " + err.message });
      }
    }
    setSubmitting(false);
  }

  const headerControls = (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", background: "white", padding: "5px 12px", borderRadius: "20px", gap: "6px", border: "1px solid #E0E0E0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <Languages size={16} color="#2E7D32" />
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", fontWeight: "600", color: "#2E7D32" }}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>
    </div>
  );

  return (
    <Layout title={t.title} showBack>
      <div className="page-content">
        {headerControls}

        {!isOnline && (
          <div className="alert alert-info" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <WifiOff size={18} /> {t.offlineMsg}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            {success.type === "online" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle size={18} /> {t.successOnline} <strong>{success.id}</strong></span>}
            {success.type === "offline" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Save size={18} /> {t.successOffline}</span>}
            {success.type === "offline_fallback" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><AlertTriangle size={18} /> {t.successError} {success.message})</span>}
          </div>
        )}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        
        <div style={{ display: "flex", background: "#f5f5f5", padding: "4px", borderRadius: "8px", marginBottom: "20px" }}>
           <button onClick={() => setActiveTab("standard")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", background: activeTab === "standard" ? "white" : "transparent", fontWeight: activeTab === "standard" ? "700" : "500", color: activeTab === "standard" ? "#2E7D32" : "#666", boxShadow: activeTab === "standard" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><FileText size={16} /> Fill a Form</div></button>
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
           <form onSubmit={handleSubmit} className="report-form" noValidate>
            
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1B5E20", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <Info size={18}/> About Your Animals
              </h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="species">{t.lblSpecies}</label>
                <select id="species" name="species" className={"form-control" + (errors.species ? " form-control-error" : "")} value={form.species} onChange={handleChange}>
                  <option value="">{t.selSpecies}</option>
                  {SPECIES_LIST.map((s) => <option key={s} value={s}>{t.species[s] || s}</option>)}
                </select>
                {errors.species && <span className="form-error">{errors.species}</span>}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t.lblHerdSize || "Total Animals (Herd Size)"}</label>
                  <input name="herdSize" type="number" min="0" className="form-control" value={form.herdSize} onChange={handleChange} placeholder="e.g. 50" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t.lblAnimalId || "Animal ID/Tag (Optional)"}</label>
                  <input name="animalId" type="text" className="form-control" value={form.animalId} onChange={handleChange} placeholder="e.g. Tag 102" />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t.lblVillage}</label>
                <input name="village" type="text" className={"form-control" + (errors.village ? " form-control-error" : "")} value={form.village} onChange={handleChange} placeholder={t.phVillage} />
                {errors.village && <span className="form-error">{errors.village}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblGps || "Farm Location"}</label>
                <button type="button" className="btn btn-outline btn-block" onClick={getLocation} disabled={locLoading}>
                  {locLoading ? <Loader size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {locLoading ? t.btnLocLoading : t.btnLocGet}
                </button>
                {location.lat && location.lng && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "#2E7D32", fontSize: "13px", fontWeight: "700", background: "#E8F5E9", padding: "8px 12px", borderRadius: "8px" }}>
                    <CheckCircle size={16} /> Location Recorded: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#C62828", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <Activity size={18}/> What are the Symptoms?
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="syndrome">{t.lblSyndrome || "Main Disease/Problem"}</label>
                <select id="syndrome" name="syndrome" className={"form-control" + (errors.syndrome ? " form-control-error" : "")} value={form.syndrome} onChange={handleChange}>
                  <option value="">{t.selSyndrome}</option>
                  {SYNDROME_LIST.map((s) => <option key={s} value={s}>{t.syndrome[s] || s}</option>)}
                </select>
                {errors.syndrome && <span className="form-error">{errors.syndrome}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblOnsetDate || "When did the animal get sick?"}</label>
                <input name="onsetDate" type="date" className="form-control" value={form.onsetDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblSymptoms}</label>
                <div className="symptom-grid">
                  {SYMPTOM_LIST.map((symptom) => (
                    <label key={symptom} className={"symptom-chip" + (form.symptoms.includes(symptom) ? " selected" : "")}>
                      <input type="checkbox" checked={form.symptoms.includes(symptom)} onChange={() => handleSymptomToggle(symptom)} className="symptom-check-input" />
                      {t.symptoms[symptom] || symptom}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblMortality || "How many animals died? (if any)"}</label>
                <input name="mortalityCount" type="number" min="0" className="form-control" value={form.mortalityCount} onChange={handleChange} placeholder="0" />
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1565C0", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <ShieldAlert size={18}/> Farm History & Context
              </h3>

              <div className="form-group">
                <label className="form-label">{t.lblVaccine || "Has this animal been vaccinated?"}</label>
                <select name="vaccinationStatus" className="form-control" value={form.vaccinationStatus} onChange={handleChange}>
                  {VACCINE_LIST.map((v) => <option key={v} value={v}>{t.vaccine[v] || v}</option>)}
                </select>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                 <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#333", cursor: "pointer" }}>
                    <input type="checkbox" name="recentMovement" checked={form.recentMovement} onChange={(e) => setForm(p => ({...p, recentMovement: e.target.checked}))} style={{ width: "18px", height: "18px", accentColor: "#1565C0" }} />
                    {t.lblRecentMovement || "Did you move this animal to a market recently?"}
                 </label>
                 <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#333", cursor: "pointer" }}>
                    <input type="checkbox" name="newAnimals" checked={form.newAnimals} onChange={(e) => setForm(p => ({...p, newAnimals: e.target.checked}))} style={{ width: "18px", height: "18px", accentColor: "#1565C0" }} />
                    {t.lblNewAnimals || "Did you buy any new animals recently?"}
                 </label>
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblNotes || "Any other details? (Optional)"}</label>
                <textarea name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} placeholder={t.phNotes} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: "14px", fontSize: "16px", marginBottom: "20px" }} disabled={submitting}>
              {submitting ? <Loader size={20} className="animate-spin" /> : (isOnline ? <Send size={20} /> : <Save size={20} />)}
              <span style={{ marginLeft: "8px" }}>{submitting ? t.btnSubmitting : (isOnline ? t.btnSubmit : t.btnSaveOffline)}</span>
            </button>
          </form>
           </>
        )}
      </div>
    </Layout>
  );
}
