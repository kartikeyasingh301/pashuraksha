import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, BookOpen, Languages, Thermometer, Syringe, ShieldAlert, Phone } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { apiGet } from '../../api/client.js';
import { useSyncContext } from '../../contexts/SyncContext.jsx';

const TRANSLATIONS = {
  en: {
    sub: 'How are your animals doing today?',
    report: 'Report Animal Health Issue',
    recent: 'Your Recent Reports',
    noReports: 'No reports yet. Submit your first report!',
    advisory: 'Health Advisories',
    seasonal: 'Seasonal Health Guide',
    seasonalSub: 'Check the latest disease prevention tips.',
    tipTitle: 'Quick Tips for Healthy Livestock',
    tips: [
      { icon: 'syringe', text: 'Vaccinate cattle every 6 months for FMD' },
      { icon: 'thermometer', text: 'Check body temp daily — normal is 38–39.5°C' },
      { icon: 'shield', text: 'Isolate any sick animal immediately' },
      { icon: 'phone', text: 'Call helpline 1962 for free vet advice' },
    ],
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    loading: 'Loading...',
  },
  hi: {
    sub: 'आज आपके पशु कैसे हैं?',
    report: 'पशु स्वास्थ्य समस्या की रिपोर्ट करें',
    recent: 'आपकी हालिया रिपोर्ट',
    noReports: 'अभी तक कोई रिपोर्ट नहीं। पहली रिपोर्ट दर्ज करें!',
    advisory: 'स्वास्थ्य सलाह',
    seasonal: 'मौसमी स्वास्थ्य गाइड',
    seasonalSub: 'नवीनतम रोग निवारण युक्तियाँ देखें।',
    tipTitle: 'स्वस्थ पशुओं के लिए त्वरित सुझाव',
    tips: [
      { icon: 'syringe', text: 'हर 6 महीने में FMD टीका लगाएं' },
      { icon: 'thermometer', text: 'रोज़ तापमान जांचें — सामान्य 38–39.5°C है' },
      { icon: 'shield', text: 'बीमार पशु को तुरंत अलग करें' },
      { icon: 'phone', text: 'मुफ्त पशु सलाह के लिए 1962 पर कॉल करें' },
    ],
    morning: 'शुभ प्रभात',
    afternoon: 'शुभ दोपहर',
    evening: 'शुभ संध्या',
    loading: 'लोड हो रहा है...',
  },
  mr: {
    sub: 'आज तुमचे प्राणी कसे आहेत?',
    report: 'प्राण्यांच्या आरोग्य समस्येची नोंद करा',
    recent: 'तुमचे अलीकडील अहवाल',
    noReports: 'अद्याप कोणतेही अहवाल नाहीत. पहिला अहवाल सबमिट करा!',
    advisory: 'आरोग्य सल्ला',
    seasonal: 'हंगामी आरोग्य मार्गदर्शक',
    seasonalSub: 'नवीनतम रोग प्रतिबंधक टिप्स तपासा.',
    tipTitle: 'निरोगी पशुधनासाठी त्वरित टिप्स',
    tips: [
      { icon: 'syringe', text: 'दर 6 महिन्यांनी FMD लस द्या' },
      { icon: 'thermometer', text: 'रोज तापमान तपासा — सामान्य 38–39.5°C आहे' },
      { icon: 'shield', text: 'आजारी प्राण्याला लगेच वेगळे करा' },
      { icon: 'phone', text: 'मोफत पशु सल्ल्यासाठी 1962 वर कॉल करा' },
    ],
    morning: 'शुभ प्रभात',
    afternoon: 'शुभ दुपार',
    evening: 'शुभ संध्याकाळ',
    loading: 'लोड होत आहे...',
  },
};

const TIP_ICONS = {
  syringe: <Syringe size={20} color="#2E7D32" />,
  thermometer: <Thermometer size={20} color="#E65100" />,
  shield: <ShieldAlert size={20} color="#C62828" />,
  phone: <Phone size={20} color="#1565C0" />,
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useSyncContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');

  const t = TRANSLATIONS[lang];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.morning : hour < 17 ? t.afternoon : t.evening;

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await apiGet('/reports/my');
        setReports(data.reports || data || []);
      } catch (_) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [pendingCount]);

  return (
    <Layout title="Farmer Dashboard">
      <div className="page-content" style={{ paddingBottom: '100px' }}>

        {/* Language Switcher */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', gap: '6px' }}>
            <Languages size={16} color="#2E7D32" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '700', color: '#2E7D32' }}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 60%, #66BB6A 100%)',
          borderRadius: '20px',
          padding: '28px 20px',
          marginBottom: '20px',
          boxShadow: '0 6px 20px rgba(46,125,50,0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <p style={{ color: '#A5D6A7', margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>PashuSuraksha</p>
          <h2 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800' }}>{greeting},</h2>
          <h2 style={{ color: '#C8E6C9', margin: '0 0 10px 0', fontSize: '20px', fontWeight: '700' }}>{user?.name || user?.username} 🌾</h2>
          <p style={{ color: '#E8F5E9', margin: 0, fontSize: '15px' }}>{t.sub}</p>
        </div>

        {/* Big Report Button */}
        <button onClick={() => navigate('/farmer/report')}
          style={{
            width: '100%', padding: '18px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #2E7D32, #43A047)',
            border: 'none', color: 'white', fontSize: '17px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 4px 15px rgba(46,125,50,0.4)', cursor: 'pointer', marginBottom: '20px'
          }}>
          <ClipboardList size={22} /> {t.report}
        </button>

        {/* Quick Tip Cards */}
        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#1B5E20' }}>{t.tipTitle}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {t.tips.map((tip, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '12px', padding: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                display: 'flex', flexDirection: 'column', gap: '8px',
                border: '1px solid #f0f0f0'
              }}>
                <div>{TIP_ICONS[tip.icon]}</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: '1.4', fontWeight: '500' }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section className="section" style={{ marginBottom: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>{t.recent}</h3>
          {loading ? (
            <div className="loading-state">{t.loading}</div>
          ) : reports.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: '12px', color: '#888' }}>
              <ClipboardList size={40} color="#ccc" style={{ marginBottom: '10px' }} />
              <p style={{ margin: 0 }}>{t.noReports}</p>
            </div>
          ) : (
            <div className="report-list">
              {reports.slice(0, 5).map((report, idx) => (
                <div key={report.id || report.local_id || idx} className="report-card card"
                  onClick={() => navigate('/farmer/report/' + (report.id || report.local_id))}
                  style={{ borderRadius: '12px', marginBottom: '10px', padding: '14px', cursor: 'pointer' }}>
                  <div className="report-header">
                    <strong className="report-syndrome">{report.syndrome || report.disease || 'Unknown'}</strong>
                    <PipelineTag status={report.status || 'REPORT'} />
                  </div>
                  <div className="report-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#888" />
                      <span className="report-village" style={{ fontSize: '13px', color: '#666' }}>{report.village || 'Unknown location'}</span>
                    </div>
                    <span className="report-species" style={{ fontSize: '13px', color: '#888' }}>— {report.species || 'Animal'}</span>
                  </div>
                  <div className="report-footer">
                    <span className="report-date" style={{ fontSize: '12px', color: '#aaa' }}>{new Date(report.capturedAt || report.captured_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Advisory Link */}
        <section className="section">
          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>{t.advisory}</h3>
          <div onClick={() => navigate('/farmer/advisory')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'white', borderRadius: '14px', padding: '18px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer',
              border: '1px solid #E8F5E9'
            }}>
            <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '12px' }}>
              <BookOpen size={26} color="#2E7D32" />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '15px', color: '#1B5E20' }}>{t.seasonal}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{t.seasonalSub}</p>
            </div>
            <span style={{ fontSize: '22px', color: '#aaa' }}>›</span>
          </div>
        </section>

      </div>
    </Layout>
  );
}