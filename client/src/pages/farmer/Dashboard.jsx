import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, MapPin, BookOpen, Languages, Thermometer, Syringe, ShieldAlert, Phone, FileText } from "lucide-react";
import Layout from "../../components/Layout.jsx";
import PipelineTag from "../../components/PipelineTag.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { apiGet } from "../../api/client.js";
import { useSyncContext } from "../../contexts/SyncContext.jsx";

const TRANSLATIONS = {
  en: {
    sub: "How are your animals doing today?",
    report: "Report Animal Health Issue",
    recent: "Your Recent Reports",
    noReports: "No reports yet. Submit your first report!",
    advisory: "Health Advisories",
    seasonal: "Seasonal Health Guide",
    seasonalSub: "Check the latest disease prevention tips.",
    tipTitle: "Quick Tips for Healthy Livestock",
    tips: [
      { icon: "syringe",      text: "Vaccinate cattle every 6 months for FMD" },
      { icon: "thermometer",  text: "Check body temp daily — normal is 38–39.5°C" },
      { icon: "shield",       text: "Isolate any sick animal immediately" },
      { icon: "phone",        text: "Call helpline 1962 for free vet advice" },
    ],
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", loading: "Loading...",
  },
  hi: {
    sub: "आज आपके पशु कैसे हैं?",
    report: "पशु स्वास्थ्य समस्या की रिपोर्ट करें",
    recent: "आपकी हालिया रिपोर्ट",
    noReports: "अभी तक कोई रिपोर्ट नहीं।",
    advisory: "स्वास्थ्य सलाह",
    seasonal: "मौसमी स्वास्थ्य गाइड",
    seasonalSub: "नवीनतम रोग निवारण युक्तियाँ देखें।",
    tipTitle: "स्वस्थ पशुओं के लिए सुझाव",
    tips: [
      { icon: "syringe",     text: "हर 6 महीने में FMD टीका लगाएं" },
      { icon: "thermometer", text: "रोज़ तापमान जांचें — सामान्य 38–39.5°C है" },
      { icon: "shield",      text: "बीमार पशु को तुरंत अलग करें" },
      { icon: "phone",       text: "मुफ्त सलाह के लिए 1962 पर कॉल करें" },
    ],
    morning: "शुभ प्रभात", afternoon: "शुभ दोपहर", evening: "शुभ संध्या", loading: "लोड हो रहा है...",
  },
  mr: {
    sub: "आज तुमचे प्राणी कसे आहेत?",
    report: "प्राण्यांच्या आरोग्य समस्येची नोंद करा",
    recent: "तुमचे अलीकडील अहवाल",
    noReports: "अद्याप कोणतेही अहवाल नाहीत.",
    advisory: "आरोग्य सल्ला",
    seasonal: "हंगामी आरोग्य मार्गदर्शक",
    seasonalSub: "नवीनतम रोग प्रतिबंधक टिप्स तपासा.",
    tipTitle: "निरोगी पशुधनासाठी टिप्स",
    tips: [
      { icon: "syringe",     text: "दर 6 महिन्यांनी FMD लस द्या" },
      { icon: "thermometer", text: "रोज तापमान तपासा — सामान्य 38–39.5°C आहे" },
      { icon: "shield",      text: "आजारी प्राण्याला लगेच वेगळे करा" },
      { icon: "phone",       text: "मोफत सल्ल्यासाठी 1962 वर कॉल करा" },
    ],
    morning: "शुभ प्रभात", afternoon: "शुभ दुपार", evening: "शुभ संध्याकाळ", loading: "लोड होत आहे...",
  },
};

const TIP_ICONS = {
  syringe:     <Syringe size={20} color="#2E7D32" />,
  thermometer: <Thermometer size={20} color="#E65100" />,
  shield:      <ShieldAlert size={20} color="#C62828" />,
  phone:       <Phone size={20} color="#1565C0" />,
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useSyncContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");

  const t = TRANSLATIONS[lang];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.morning : hour < 17 ? t.afternoon : t.evening;

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await apiGet("/reports/my");
        setReports(data.reports || data || []);
      } catch (_) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [pendingCount]);

  /* ── Hero banner rendered OUTSIDE page-content so it goes full width ── */
  const heroBanner = (
    <div style={{
      background: "linear-gradient(135deg, #1B5E20 0%, #388E3C 60%, #66BB6A 100%)",
      padding: "28px 20px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, background:"rgba(255,255,255,0.07)", borderRadius:"50%" }} />
      <div style={{ position:"absolute", bottom:-40, right:40, width:110, height:110, background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />

      {/* Language Switcher */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"14px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.18)", padding:"5px 12px", borderRadius:"20px", gap:"6px", border:"1px solid rgba(255,255,255,0.25)" }}>
          <Languages size={14} color="#fff" />
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            style={{ border:"none", background:"transparent", outline:"none", fontSize:"13px", fontWeight:"700", color:"#fff" }}>
            <option value="en" style={{ color:"#000" }}>English</option>
            <option value="hi" style={{ color:"#000" }}>हिंदी</option>
            <option value="mr" style={{ color:"#000" }}>मराठी</option>
          </select>
        </div>
      </div>

      <p style={{ color:"#A5D6A7", margin:"0 0 4px 0", fontSize:"12px", fontWeight:"600", textTransform:"uppercase", letterSpacing:"1.5px", position:"relative", zIndex:1 }}>Pashuraksha</p>
      <h2 style={{ color:"white", margin:"0 0 4px 0", fontSize:"24px", fontWeight:"800", position:"relative", zIndex:1 }}>{greeting},</h2>
      <h2 style={{ color:"#C8E6C9", margin:"0 0 10px 0", fontSize:"20px", fontWeight:"700", position:"relative", zIndex:1 }}>{user?.name || user?.username}</h2>
      <p style={{ color:"#E8F5E9", margin:0, fontSize:"14px", position:"relative", zIndex:1 }}>{t.sub}</p>
    </div>
  );

  return (
    <Layout title="Farmer Dashboard" hero={heroBanner}>
      <div className="page-content" style={{ paddingBottom:"100px" }}>

        {/* Report Button */}
        <button onClick={() => navigate("/farmer/report")} style={{
          width:"100%", padding:"18px", borderRadius:"14px", marginTop:"20px",
          background:"linear-gradient(135deg, #2E7D32, #43A047)",
          border:"none", color:"white", fontSize:"17px", fontWeight:"700",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          boxShadow:"0 4px 15px rgba(46,125,50,0.4)", cursor:"pointer", marginBottom:"16px"
        }}>
          <ClipboardList size={22} /> {t.report}
        </button>

        {/* Herd & Passbook */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
          <button onClick={() => navigate("/farmer/herd")} style={{
            padding:"16px 12px", borderRadius:"14px", border:"2px solid #E8F5E9",
            background:"white", color:"#1B5E20", fontSize:"14px", fontWeight:"700",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"8px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer"
          }}>
            <FileText size={28} color="#1B5E20" />
            My Herd Ledger
          </button>
          <button onClick={() => navigate("/farmer/passbook")} style={{
            padding:"16px 12px", borderRadius:"14px", border:"2px solid #E3F2FD",
            background:"white", color:"#1565C0", fontSize:"14px", fontWeight:"700",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"8px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer"
          }}>
            <Syringe size={28} color="#1565C0" />
            Vaccine Passbook
          </button>
        </div>

        {/* Quick Tips */}
        <section style={{ marginBottom:"20px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"700", marginBottom:"12px", color:"#1B5E20" }}>{t.tipTitle}</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {t.tips.map((tip, i) => (
              <div key={i} style={{
                background:"white", borderRadius:"12px", padding:"14px",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                display:"flex", flexDirection:"column", gap:"8px",
                border:"1px solid #f0f0f0"
              }}>
                <div>{TIP_ICONS[tip.icon]}</div>
                <p style={{ margin:0, fontSize:"13px", color:"#444", lineHeight:"1.4", fontWeight:"500" }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section style={{ marginBottom:"20px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#1B5E20", marginBottom:"12px" }}>{t.recent}</h3>
          {loading ? (
            <div className="loading-state">{t.loading}</div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", background:"white", borderRadius:"12px", color:"#888" }}>
              <ClipboardList size={40} color="#ccc" style={{ marginBottom:"10px" }} />
              <p style={{ margin:0 }}>{t.noReports}</p>
            </div>
          ) : (
            <div>
              {reports.slice(0, 5).map((report, idx) => (
                <div key={report.id || report.local_id || idx}
                  onClick={() => navigate("/farmer/report/" + (report.id || report.local_id))}
                  style={{ background:"white", borderRadius:"12px", marginBottom:"10px", padding:"14px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
                  <div className="report-header">
                    <strong className="report-syndrome">{report.syndrome || report.disease || "Unknown"}</strong>
                    <PipelineTag status={report.status || "REPORT"} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"6px" }}>
                    <MapPin size={14} color="#888" />
                    <span style={{ fontSize:"13px", color:"#666" }}>{report.village || "Unknown location"}</span>
                    <span style={{ fontSize:"13px", color:"#aaa", marginLeft:"8px" }}>— {report.species || "Animal"}</span>
                  </div>
                  <div style={{ marginTop:"6px" }}>
                    <span style={{ fontSize:"12px", color:"#aaa" }}>{new Date(report.capturedAt || report.captured_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Advisory Link */}
        <section>
          <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#1B5E20", marginBottom:"12px" }}>{t.advisory}</h3>
          <div onClick={() => navigate("/farmer/advisory")} style={{
            display:"flex", alignItems:"center", gap:"16px",
            background:"white", borderRadius:"14px", padding:"18px",
            boxShadow:"0 2px 10px rgba(0,0,0,0.06)", cursor:"pointer",
            border:"1px solid #E8F5E9"
          }}>
            <div style={{ background:"#E8F5E9", borderRadius:"12px", padding:"12px" }}>
              <BookOpen size={26} color="#2E7D32" />
            </div>
            <div style={{ flex:1 }}>
              <strong style={{ fontSize:"15px", color:"#1B5E20" }}>{t.seasonal}</strong>
              <p style={{ margin:"4px 0 0 0", fontSize:"13px", color:"#666" }}>{t.seasonalSub}</p>
            </div>
            <span style={{ fontSize:"22px", color:"#aaa" }}>›</span>
          </div>
        </section>

      </div>
    </Layout>
  );
}
