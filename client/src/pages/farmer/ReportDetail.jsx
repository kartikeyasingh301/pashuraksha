import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, AlertCircle, FileText, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.js';
import { apiGet } from '../../api/client.js';
import db from '../../db/dexie.js';

function formatKolkataTime(isoString) {
  if (!isoString) return "Unknown Date";
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(isoString));
}


const TRANSLATIONS = {
  en: {
    back: "Back to Dashboard",
    title: "Detailed Health Report",
    loading: "Loading report details...",
    error: "Could not load report.",
    status: "Current Status",
    symptoms: "Reported Symptoms",
    location: "Location",
    species: "Animal Species",
    syndrome: "Suspected Disease",
    date: "Reported On",
    mortality: "Animal Deaths",
    mortalityNone: "None reported",
    vaccination: "Vaccination Status",
    vaccinationUnknown: "Unknown",
    vaccinationYes: "Vaccinated",
    vaccinationNo: "Not Vaccinated",
    notes: "Veterinarian Notes",
    notesNone: "No notes attached yet",
    id: "Report Tracking ID"
  },
  hi: {
    back: "डैशबोर्ड पर वापस जाएं",
    title: "विस्तृत स्वास्थ्य रिपोर्ट",
    loading: "रिपोर्ट लोड हो रही है...",
    error: "रिपोर्ट लोड नहीं हो सकी।",
    status: "वर्तमान स्थिति",
    symptoms: "दर्ज किए गए लक्षण",
    location: "स्थान",
    species: "पशु",
    syndrome: "संभावित बीमारी",
    date: "रिपोर्ट करने की तिथि",
    mortality: "पशुओं की मृत्यु",
    mortalityNone: "कोई मृत्यु दर्ज नहीं",
    vaccination: "टीकाकरण की स्थिति",
    vaccinationUnknown: "अज्ञात",
    vaccinationYes: "टीका लगा है",
    vaccinationNo: "टीका नहीं लगा है",
    notes: "डॉक्टर की टिप्पणी",
    notesNone: "अभी तक कोई टिप्पणी नहीं",
    id: "रिपोर्ट ट्रैकिंग आईडी"
  },
  mr: {
    back: "डॅशबोर्डवर परत जा",
    title: "सविस्तर आरोग्य अहवाल",
    loading: "अहवाल लोड होत आहे...",
    error: "अहवाल लोड होऊ शकला नाही.",
    status: "सद्य स्थिती",
    symptoms: "नोंदवलेली लक्षणे",
    location: "स्थान",
    species: "प्राणी",
    syndrome: "संभाव्य आजार",
    date: "अहवाल दिल्याची तारीख",
    mortality: "प्राण्यांचा मृत्यू",
    mortalityNone: "कोणताही मृत्यू नोंदवला नाही",
    vaccination: "लसीकरणाची स्थिती",
    vaccinationUnknown: "माहित नाही",
    vaccinationYes: "लसीकरण झाले आहे",
    vaccinationNo: "लसीकरण झालेले नाही",
    notes: "डॉक्टरांची नोंद",
    notesNone: "अद्याप कोणतीही नोंद नाही",
    id: "अहवाल ट्रॅकिंग आयडी"
  }
};

const getTranslatedDisease = (disease, lang) => {
  if (!disease) return "Unknown";
  const d = disease.toUpperCase();
  if (lang === 'hi') {
    if (d.includes('FMD') || d.includes('FOOT')) return 'खुरपका-मुँहपका रोग (FMD)';
    if (d.includes('LSD') || d.includes('LUMPY')) return 'लंपी त्वचा रोग (LSD)';
    if (d.includes('PPR')) return 'पीपीआर (बकरी प्लेग)';
    if (d.includes('MASTITIS')) return 'थनैला रोग (Mastitis)';
    if (d.includes('BQ') || d.includes('BLACK')) return 'लंगड़ा बुखार (Black Quarter)';
    if (d.includes('ANTHRAX')) return 'गिल्टी रोग (Anthrax)';
  }
  if (lang === 'mr') {
    if (d.includes('FMD') || d.includes('FOOT')) return 'लाळ्या खुरकूत (FMD)';
    if (d.includes('LSD') || d.includes('LUMPY')) return 'लंपी स्किन डिसीज (LSD)';
    if (d.includes('PPR')) return 'पीपीआर (शेळ्यांचा प्लेग)';
    if (d.includes('MASTITIS')) return 'मस्टायटीस (सडाचा आजार)';
    if (d.includes('BQ') || d.includes('BLACK')) return 'फऱ्या (Black Quarter)';
    if (d.includes('ANTHRAX')) return 'अँथ्रॅक्स';
  }
  return disease;
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang] = useLanguage();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        // Try server first
        const data = await apiGet(`/reports/${id}`);
        setReport(data.report || data);
      } catch (err) {
        // Fallback to local IndexedDB if offline or server fails
        try {
          const localReport = await db.reports.get(id);
          if (localReport) {
             setReport(localReport);
          } else {
             // Also search by local_id in case the route passed local_id
             const byLocalId = await db.offlineQueue.where('localId').equals(id).first();
             if (byLocalId) setReport(byLocalId);
          }
        } catch (dbErr) {
          console.error("Local DB fetch failed", dbErr);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);


  const getTranslatedStatus = (status) => {
    if (!status) return t.statusPending || "PENDING SYNC";
    const st = status.toUpperCase();
    if (lang === 'hi') {
      if (st === 'REPORT') return 'रिपोर्ट दर्ज';
      if (st === 'CASE') return 'सत्यापित मामला';
      if (st === 'CLUSTER') return 'गंभीर मामला';
      if (st === 'SUSPECTED' || st === 'SUSPECTED_OUTBREAK') return 'संभावित प्रकोप';
      if (st === 'COMPLETED') return 'पूरा हुआ';
    }
    if (lang === 'mr') {
      if (st === 'REPORT') return 'अहवाल नोंदवला';
      if (st === 'CASE') return 'सत्यापित प्रकरण';
      if (st === 'CLUSTER') return 'गंभीर प्रकरण';
      if (st === 'SUSPECTED' || st === 'SUSPECTED_OUTBREAK') return 'संभाव्य प्रादुर्भाव';
      if (st === 'COMPLETED') return 'पूर्ण झाले';
    }
    return st;
  };

  const getStatusColor = (status) => {
    if (status === 'CASE' || status === 'CLUSTER') return '#F57C00';
    if (status === 'SUSPECTED') return '#D32F2F';
    return '#2E7D32';
  };

  return (
    <div style={{ padding: "16px", paddingBottom: "100px", maxWidth: "100%", boxSizing: "border-box" }}>
      <button 
        onClick={() => navigate('/farmer')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1B5E20', background: 'none', border: 'none', padding: '10px 0', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}
      >
        <ArrowLeft size={20} />
        {t.back}
      </button>

      <h1 style={{ fontSize: "24px", color: "#1B5E20", margin: "0 0 20px 0" }}>{t.title}</h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>{t.loading}</div>
      ) : !report ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#D32F2F" }}>{t.error}</div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
            <div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>{t.syndrome}</div>
              <strong style={{ fontSize: "20px", color: "#111" }}>{report.syndrome || report.disease}</strong>
            </div>
            <div style={{ background: getStatusColor(report.status), color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              {getTranslatedStatus(report.status)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", color: "#2E7D32" }}>
                <Activity size={20} />
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.species}</div>
                <div style={{ fontSize: "15px", fontWeight: "600" }}>{report.species}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", color: "#F57C00" }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.symptoms}</div>
                <div style={{ fontSize: "15px", fontWeight: "600" }}>{report.symptoms || "None specified"}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", color: "#1565C0" }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.location}</div>
                <div style={{ fontSize: "15px", fontWeight: "600" }}>{report.village}, {report.district}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F3E5F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#7B1FA2" }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.date}</div>
                <div style={{ fontSize: "15px", fontWeight: "600" }}>{formatKolkataTime(report.captured_at || report.capturedAt)}</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
