import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, AlertCircle, FileText, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.js';
import { apiGet } from '../../api/client.js';

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
    title: "Report Details",
    loading: "Loading report details...",
    error: "Could not load report.",
    status: "Current Status",
    symptoms: "Reported Symptoms",
    location: "Location",
    species: "Animal Species",
    syndrome: "Suspected Issue",
    date: "Reported On"
  },
  hi: {
    back: "डैशबोर्ड पर वापस जाएं",
    title: "रिपोर्ट विवरण",
    loading: "रिपोर्ट लोड हो रही है...",
    error: "रिपोर्ट लोड नहीं हो सकी।",
    status: "वर्तमान स्थिति",
    symptoms: "लक्षण",
    location: "स्थान",
    species: "पशु",
    syndrome: "समस्या",
    date: "रिपोर्ट करने की तिथि"
  },
  mr: {
    back: "डॅशबोर्डवर परत जा",
    title: "अहवाल तपशील",
    loading: "अहवाल लोड होत आहे...",
    error: "अहवाल लोड होऊ शकला नाही.",
    status: "सद्य स्थिती",
    symptoms: "लक्षणे",
    location: "स्थान",
    species: "प्राणी",
    syndrome: "समस्या",
    date: "अहवाल दिल्याची तारीख"
  }
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
        const data = await apiGet(`/reports/${id}`);
        setReport(data.report || data);
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

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
              <strong style={{ fontSize: "20px", color: "#111" }}>{report.syndrome}</strong>
            </div>
            <div style={{ background: getStatusColor(report.status), color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              {report.status || "REPORT"}
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
                <div style={{ fontSize: "15px", fontWeight: "600" }}>{formatKolkataTime(report.captured_at)}</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
