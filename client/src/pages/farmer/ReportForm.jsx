import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Send, MapPin, Loader, Square, CheckCircle, Info, Check, Plus, Minus, Search, Activity, Camera, RotateCcw } from "lucide-react";
import Layout from "../../components/Layout.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { apiPost } from "../../api/client.js";
import { useSyncContext } from "../../contexts/SyncContext.jsx";


const SPECIES_LIST = ["Cattle", "Buffalo", "Sheep", "Goat", "Pig", "Poultry", "Dog", "Other"];
const SYNDROME_LIST = ["FMD", "PPR", "BQ", "Anthrax", "Rabies", "Brucellosis", "Theileriosis", "Lumpy Skin Disease", "HPAI", "Other"];
const SYMPTOM_LIST = ["Fever", "Lameness", "Blisters/Ulcers", "Respiratory distress", "Neurological signs", "Diarrhea", "Sudden death", "Abortion", "Swelling", "Loss of appetite", "Excessive Salivation", "Nasal Discharge", "Skin Lesions", "Coughing"];
const VACCINE_LIST = ["Vaccinated", "Unvaccinated", "Unknown"];

// We keep the translations exactly the same.
const TRANSLATIONS = {
  en: {
    title: "New Health Report", tabStd: "Standard Form", tabVoice: "Voice Report",
    lblSpecies: "Species", selSpecies: "-- Select Species --",
    lblSyndrome: "Suspected Disease / Syndrome", selSyndrome: "-- Select Syndrome --",
    lblSymptoms: "Observed Symptoms",
    lblMortality: "Mortality Count (Dead Animals)",
    lblAnimalId: "Animal ID / Tag No (Optional)", phAnimalId: "e.g., Tag 1234",
    lblVillage: "Village Location", phVillage: "Enter village name",
    lblGps: "GPS Coordinates (Optional)", btnLocGet: "Get Location", btnLocLoading: "Locating...",
    lblVaccine: "Vaccination Status",
    lblNotes: "Additional Notes (Optional)", phNotes: "Any other details...",
    btnSubmit: "Submit Report", btnSubmitting: "Submitting...", btnSaveOffline: "Save Offline",
    errReq: "This field is required",
    species: { Cattle: "Cattle", Buffalo: "Buffalo", Sheep: "Sheep", Goat: "Goat", Pig: "Pig", Poultry: "Poultry", Dog: "Dog", Other: "Other" },
    syndrome: { FMD: "Foot & Mouth Disease (FMD)", PPR: "PPR", BQ: "Black Quarter (BQ)", Anthrax: "Anthrax", Rabies: "Rabies", Brucellosis: "Brucellosis", Theileriosis: "Theileriosis", "Lumpy Skin Disease": "Lumpy Skin Disease (LSD)", HPAI: "Avian Influenza (HPAI)", Other: "Other / Unknown" },
    symptoms: { Fever: "Fever", Lameness: "Lameness", "Blisters/Ulcers": "Blisters/Ulcers", "Respiratory distress": "Breathing Issues", "Neurological signs": "Neurological (Seizures/Circling)", Diarrhea: "Diarrhea", "Sudden death": "Sudden Death", Abortion: "Abortion", Swelling: "Swelling", "Loss of appetite": "Loss of Appetite", "Excessive Salivation": "Excessive Salivation", "Nasal Discharge": "Nasal Discharge", "Skin Lesions": "Skin Lesions", Coughing: "Coughing" },
    vaccine: { Vaccinated: "Vaccinated", Unvaccinated: "Unvaccinated", Unknown: "Unknown" }
  },
  hi: {
    title: "नया स्वास्थ्य रिपोर्ट", tabStd: "मानक फॉर्म", tabVoice: "वॉयस रिपोर्ट",
    lblSpecies: "पशु की प्रजाति", selSpecies: "-- प्रजाति चुनें --",
    lblSyndrome: "संभावित बीमारी / सिंड्रोम", selSyndrome: "-- बीमारी चुनें --",
    lblSymptoms: "देखे गए लक्षण",
    lblMortality: "मृत्यु संख्या (मरे हुए पशु)",
    lblAnimalId: "पशु आईडी / टैग नंबर (वैकल्पिक)", phAnimalId: "उदा., टैग 1234",
    lblVillage: "गांव का नाम", phVillage: "गांव का नाम दर्ज करें",
    lblGps: "जीपीएस (वैकल्पिक)", btnLocGet: "स्थान प्राप्त करें", btnLocLoading: "खोज रहा है...",
    lblVaccine: "टीकाकरण की स्थिति",
    lblNotes: "अतिरिक्त जानकारी (वैकल्पिक)", phNotes: "कोई अन्य विवरण...",
    btnSubmit: "रिपोर्ट जमा करें", btnSubmitting: "जमा कर रहा है...", btnSaveOffline: "ऑफ़लाइन सहेजें",
    errReq: "यह फ़ील्ड आवश्यक है",
    species: { Cattle: "गाय/बैल", Buffalo: "भैंस", Sheep: "भेड़", Goat: "बकरी", Pig: "सुअर", Poultry: "मुर्गी", Dog: "कुत्ता", Other: "अन्य" },
    syndrome: { FMD: "खुरपका-मुंहपका (FMD)", PPR: "पीपीआर (PPR)", BQ: "लंगड़ा बुखार (BQ)", Anthrax: "गिल्टी रोग (Anthrax)", Rabies: "रेबीज", Brucellosis: "ब्रुसेलोसिस", Theileriosis: "थाइलेरियासिस", "Lumpy Skin Disease": "लंपी त्वचा रोग", HPAI: "बर्ड फ्लू", Other: "अन्य / अज्ञात" },
    symptoms: { Fever: "बुखार", Lameness: "लंगड़ापन", "Blisters/Ulcers": "छाले/घाव", "Respiratory distress": "सांस लेने में तकलीफ", "Neurological signs": "दौरे/चक्कर आना", Diarrhea: "दस्त", "Sudden death": "अचानक मौत", Abortion: "गर्भपात", Swelling: "सूजन", "Loss of appetite": "भूख न लगना", "Excessive Salivation": "अत्यधिक लार", "Nasal Discharge": "नाक बहना", "Skin Lesions": "त्वचा पर चकत्ते", Coughing: "खांसी" },
    vaccine: { Vaccinated: "टीका लगा है", Unvaccinated: "टीका नहीं लगा", Unknown: "पता नहीं" }
  },
  mr: {
    title: "नवीन आरोग्य अहवाल", tabStd: "प्रमाणित फॉर्म", tabVoice: "व्हॉइस अहवाल",
    lblSpecies: "प्राण्याची प्रजात", selSpecies: "-- प्रजात निवडा --",
    lblSyndrome: "संभाव्य आजार / सिंड्रोम", selSyndrome: "-- आजार निवडा --",
    lblSymptoms: "आढळलेली लक्षणे",
    lblMortality: "मृत्यू संख्या (मेलेले प्राणी)",
    lblAnimalId: "प्राणी आयडी / टॅग क्र (पर्यायी)", phAnimalId: "उदा., टॅग 1234",
    lblVillage: "गावाचे नाव", phVillage: "गावाचे नाव प्रविष्ट करा",
    lblGps: "जीपीएस (पर्यायी)", btnLocGet: "स्थान मिळवा", btnLocLoading: "शोधत आहे...",
    lblVaccine: "लसीकरण स्थिती",
    lblNotes: "अतिरिक्त माहिती (पर्यायी)", phNotes: "इतर कोणताही तपशील...",
    btnSubmit: "अहवाल सबमिट करा", btnSubmitting: "सबमिट करत आहे...", btnSaveOffline: "ऑफलाइन सेव्ह करा",
    errReq: "हे क्षेत्र आवश्यक आहे",
    species: { Cattle: "गाय/बैल", Buffalo: "म्हैस", Sheep: "मेंढी", Goat: "शेळी", Pig: "डुक्कर", Poultry: "कोंबडी", Dog: "कुत्रा", Other: "इतर" },
    syndrome: { FMD: "लाळ्या-खुरकूत (FMD)", PPR: "पीपीआर (PPR)", BQ: "फऱ्या (BQ)", Anthrax: "अँथ्रॅक्स", Rabies: "रेबीज", Brucellosis: "ब्रुसेलोसिस", Theileriosis: "थायलेरियासिस", "Lumpy Skin Disease": "लम्पी त्वचा रोग", HPAI: "बर्ड फ्लू", Other: "इतर / अज्ञात" },
    symptoms: { Fever: "ताप", Lameness: "लंगडणे", "Blisters/Ulcers": "फोड/व्रण", "Respiratory distress": "श्वास घेण्यास त्रास", "Neurological signs": "फेफरे/चक्कर", Diarrhea: "हगवण", "Sudden death": "अचानक मृत्यू", Abortion: "गर्भपात", Swelling: "सूज", "Loss of appetite": "भूक न लागणे", "Excessive Salivation": "अति लाळ गळणे", "Nasal Discharge": "नाक गळणे", "Skin Lesions": "त्वचेवर पुरळ", Coughing: "खोकला" },
    vaccine: { Vaccinated: "लसीकरण झालेले", Unvaccinated: "लसीकरण न झालेले", Unknown: "माहित नाही" }
  }
};

export default function ReportForm() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState("standard");
  const [voiceState, setVoiceState] = useState("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOnline, addPendingReport } = useSyncContext();

  const t = TRANSLATIONS[lang];

  const [form, setForm] = useState({
    species: "", syndrome: "", symptoms: [],
    mortalityCount: 0, animalId: "", village: user?.district || "Nashik",
    vaccinationStatus: "Unknown", notes: ""
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [syndromeSearch, setSyndromeSearch] = useState("");
  const [showSyndromeDropdown, setShowSyndromeDropdown] = useState(false);

  useEffect(() => {
    let interval;
    if (voiceState === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      setTimeout(() => {
        clearInterval(interval);
        setVoiceState("processing");
        setTimeout(() => {
          setVoiceState("verify");
          setTranscript("My cow has fever and blisters. It is having difficulty walking.");
          setForm(prev => ({ ...prev, species: "Cattle", syndrome: "FMD", symptoms: ["Fever", "Blisters/Ulcers", "Lameness"], notes: "Auto-extracted from voice." }));
        }, 2000);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [voiceState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSymptomToggle = (symptom) => {
    setForm(prev => {
      const isSelected = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: isSelected ? prev.symptoms.filter(s => s !== symptom) : [...prev.symptoms, symptom]
      };
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocError("GPS not supported");
      return;
    }
    setLocLoading(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      (err) => {
        setLocError("Failed to get location");
        setLocLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrs = {};
    if (!form.species) newErrs.species = t.errReq;
    if (!form.syndrome) newErrs.syndrome = t.errReq;
    if (!form.village) newErrs.village = t.errReq;
    
    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    setSubmitting(true);
    const payload = {
      local_id: `${user?.id}_${Date.now()}_${form.species}_${form.village.trim()}`,
      ...form,
      latitude: location.lat,
      longitude: location.lng,
      captured_at: new Date().toISOString()
    };

    if (isOnline) {
      try {
        await apiPost('/reports', payload);
        navigate('/farmer');
      } catch (err) {
        addPendingReport(payload);
        navigate('/farmer');
      }
    } else {
      addPendingReport(payload);
      navigate('/farmer');
    }
  };

  return (
    <Layout lang={lang} setLang={setLang} title={t.title} showBack={true}>
      <div className="page-content form-content" style={{ paddingBottom: '120px' }}>
        
        {/* Tabs - Emojis removed, Lucide icons used */}
        <div style={{ display: "flex", background: "white", padding: "4px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border)", marginBottom: "24px" }}>
           <button 
             onClick={() => { setActiveTab("standard"); setVoiceState("idle"); }}
             style={{ flex: 1, padding: "10px", border: "none", background: activeTab === "standard" ? "var(--brand-50)" : "transparent", color: activeTab === "standard" ? "var(--brand-700)" : "var(--text-secondary)", borderRadius: "var(--radius-pill)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
             <Activity size={18} /> {t.tabStd}
           </button>
           <button 
             onClick={() => setActiveTab("voice")}
             style={{ flex: 1, padding: "10px", border: "none", background: activeTab === "voice" ? "var(--brand-50)" : "transparent", color: activeTab === "voice" ? "var(--brand-700)" : "var(--text-secondary)", borderRadius: "var(--radius-pill)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
             <Mic size={18} /> {t.tabVoice}
           </button>
        </div>

        {activeTab === "voice" && voiceState !== "verify" && (
           <div style={{ background: "white", padding: "40px 20px", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {voiceState === "idle" && (
                 <>
                    <button onClick={() => { setVoiceState("recording"); setRecordingTime(0); }} 
                      style={{ width: "96px", height: "96px", borderRadius: "48px", background: "var(--brand-600)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: "24px", boxShadow: "0 8px 24px rgba(30,108,69,0.3)", transition: "transform 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                       <Mic size={40} />
                    </button>
                    <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>Voice Report</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 16px 0" }}>Tap the microphone and describe the animal's symptoms, species, and your location.</p>
                    <div style={{ background: "var(--brand-50)", color: "var(--brand-700)", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "700" }}>
                      Language: {lang.toUpperCase()}
                    </div>
                 </>
              )}
              {voiceState === "recording" && (
                 <>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{ width: "96px", height: "96px", borderRadius: "48px", background: "var(--danger-bg)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, position: 'relative' }}>
                         <Square size={32} color="var(--danger-text)" />
                      </div>
                      <div className="pulse-ring" style={{ position: 'absolute', inset: -10, border: '4px solid var(--danger-text)', borderRadius: '50%', opacity: 0.5 }}></div>
                    </div>
                    <h3 style={{ margin: "0 0 8px 0", color: "var(--danger-text)" }}>Recording... 00:0{recordingTime}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Speak clearly into your microphone.</p>
                    <style>{`
                      @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.3); opacity: 0; } }
                      .pulse-ring { animation: pulseRing 1.5s infinite ease-out; }
                    `}</style>
                 </>
              )}
              {voiceState === "processing" && (
                 <>
                    <Loader size={48} color="var(--brand-600)" className="animate-spin" style={{ marginBottom: "24px" }} />
                    <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>Transcription in progress</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Extracting structured information from your report...</p>
                 </>
              )}
           </div>
        )}

        {(activeTab === "standard" || voiceState === "verify") && (
           <>
           {voiceState === "verify" && (
             <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "20px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-700)", fontWeight: "700", marginBottom: "12px" }}>
                   <Info size={18} /> Voice Transcript
                </div>
                <p style={{ margin: "0 0 16px 0", fontSize: "15px", color: "var(--text-primary)", fontStyle: "italic", background: "white", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                   "{transcript}"
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setVoiceState("idle")} className="btn btn-secondary" style={{ flex: 1 }}>
                    <RotateCcw size={16} /> Retry
                  </button>
                  <button onClick={() => {}} className="btn btn-primary" style={{ flex: 1 }}>
                    <Check size={16} /> Confirm
                  </button>
                </div>
             </div>
           )}
           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} noValidate>
          
          {/* Species Icon Tile Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{t.lblSpecies}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {SPECIES_LIST.map((s) => (
                <div 
                  key={s} 
                  onClick={() => { setForm(prev => ({...prev, species: s})); setErrors(prev => ({...prev, species: null})); }}
                  style={{ 
                    border: form.species === s ? '2px solid var(--brand-600)' : '1px solid var(--border)', 
                    background: form.species === s ? 'var(--brand-50)' : 'var(--surface)', 
                    borderRadius: '12px', padding: '12px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                    {s === 'Cattle' ? '🐄' : s === 'Buffalo' ? '🐃' : s === 'Sheep' ? '🐑' : s === 'Goat' ? '🐐' : s === 'Pig' ? '🐖' : s === 'Poultry' ? '🐔' : s === 'Dog' ? '🐕' : '🐾'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: form.species === s ? 'var(--brand-700)' : 'var(--text-secondary)' }}>
                    {t.species[s] || s}
                  </div>
                </div>
              ))}
            </div>
            {errors.species && <div style={{ color: 'var(--danger-text)', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{errors.species}</div>}
          </div>

          {/* Condition Searchable Select */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblSyndrome}</label>
            <div style={{ position: 'relative' }}>
              <div 
                className="searchable-select"
                onClick={() => setShowSyndromeDropdown(!showSyndromeDropdown)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: errors.syndrome ? 'var(--danger-text)' : '' }}
              >
                <span>{form.syndrome ? (t.syndrome[form.syndrome] || form.syndrome) : t.selSyndrome}</span>
                <Search size={16} color="var(--text-secondary)" />
              </div>
              {showSyndromeDropdown && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', zIndex: 10, boxShadow: 'var(--shadow-sm)', maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ padding: '8px', position: 'sticky', top: 0, background: 'var(--surface)' }}>
                    <input 
                      type="text" 
                      placeholder="Search condition..." 
                      value={syndromeSearch}
                      onChange={(e) => setSyndromeSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', outline: 'none' }}
                    />
                  </div>
                  {SYNDROME_LIST.filter(s => (t.syndrome[s]||s).toLowerCase().includes(syndromeSearch.toLowerCase())).map(s => (
                    <div 
                      key={s}
                      onClick={() => { setForm(prev => ({...prev, syndrome: s})); setShowSyndromeDropdown(false); setErrors(prev => ({...prev, syndrome: null})); }}
                      style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: form.syndrome === s ? 'var(--brand-50)' : 'transparent', color: form.syndrome === s ? 'var(--brand-700)' : 'var(--text-primary)', fontWeight: form.syndrome === s ? '600' : '400' }}
                    >
                      {t.syndrome[s] || s}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.syndrome && <div style={{ color: 'var(--danger-text)', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{errors.syndrome}</div>}
          </div>

          {/* Toggle Chips with Check */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{t.lblSymptoms}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SYMPTOM_LIST.map((symptom) => {
                const isSelected = form.symptoms.includes(symptom);
                return (
                  <div 
                    key={symptom} 
                    className={`chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {isSelected && <Check size={14} />} {t.symptoms[symptom] || symptom}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mortality Stepper */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblMortality}</label>
            <div className="stepper">
              <button type="button" className="stepper-btn" onClick={() => setForm(prev => ({...prev, mortalityCount: Math.max(0, prev.mortalityCount - 1)}))}><Minus size={18} /></button>
              <div className="stepper-val">{form.mortalityCount}</div>
              <button type="button" className="stepper-btn" onClick={() => setForm(prev => ({...prev, mortalityCount: prev.mortalityCount + 1}))}><Plus size={18} /></button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblAnimalId}</label>
            <input name="animalId" type="text" className="form-control" value={form.animalId} onChange={handleChange} placeholder={t.phAnimalId} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblVillage}</label>
            <input name="village" type="text" className="form-control" style={{ borderColor: errors.village ? 'var(--danger-text)' : '' }} value={form.village} onChange={handleChange} placeholder={t.phVillage} />
            {errors.village && <div style={{ color: 'var(--danger-text)', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{errors.village}</div>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblGps}</label>
            <button type="button" className="btn btn-outline btn-block" onClick={getLocation} disabled={locLoading}>
              {locLoading ? <Loader size={18} className="animate-spin" /> : <MapPin size={18} />}
              {locLoading ? t.btnLocLoading : t.btnLocGet}
            </button>
            {location.lat && location.lng && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "var(--success-text)", fontSize: '13px', fontWeight: '600', background: 'var(--success-bg)', padding: '8px 12px', borderRadius: '8px' }}>
                <CheckCircle size={16} /> GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{t.lblVaccine}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {VACCINE_LIST.map((v) => (
                <div 
                  key={v} 
                  className={`chip ${form.vaccinationStatus === v ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({...prev, vaccinationStatus: v}))}
                >
                  {form.vaccinationStatus === v && <Check size={14} />} {t.vaccine[v] || v}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{t.lblNotes}</label>
            <textarea name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} placeholder={t.phNotes} />
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky-submit">
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <Loader size={20} className="animate-spin" /> : (isOnline ? <Send size={20} /> : <CheckCircle size={20} />)}
              {submitting ? t.btnSubmitting : (isOnline ? t.btnSubmit : t.btnSaveOffline)}
            </button>
          </div>

        </form>
           </>
        )}
      </div>
    </Layout>
  );
}
