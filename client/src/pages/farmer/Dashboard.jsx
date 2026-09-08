import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, BookOpen, Languages } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { apiGet } from '../../api/client.js';
import { useSyncContext } from '../../contexts/SyncContext.jsx';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useSyncContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en'); // 'en', 'hi', 'mr'

  const translations = {
    en: {
      greet: 'Good',
      sub: 'How are your animals doing today?',
      report: 'Report Animal Health Issue',
      recent: 'Your Recent Reports',
      noReports: 'No reports yet. Submit your first report!',
      advisory: 'Health Advisories',
      seasonal: 'Seasonal Health Guide',
      seasonalSub: 'Check the latest disease prevention tips for your livestock.'
    },
    hi: {
      greet: 'शुभ',
      sub: 'आज आपके पशु कैसे हैं?',
      report: 'पशु स्वास्थ्य समस्या की रिपोर्ट करें',
      recent: 'आपकी हालिया रिपोर्ट',
      noReports: 'अभी तक कोई रिपोर्ट नहीं। अपनी पहली रिपोर्ट दर्ज करें!',
      advisory: 'स्वास्थ्य सलाह',
      seasonal: 'मौसमी स्वास्थ्य गाइड',
      seasonalSub: 'अपने पशुओं के लिए नवीनतम रोग निवारण युक्तियाँ देखें।'
    },
    mr: {
      greet: 'शुभ',
      sub: 'आज तुमचे प्राणी कसे आहेत?',
      report: 'प्राण्यांच्या आरोग्याच्या समस्येची नोंद करा',
      recent: 'तुमचे अलीकडील अहवाल',
      noReports: 'अद्याप कोणतेही अहवाल नाहीत. तुमचा पहिला अहवाल सबमिट करा!',
      advisory: 'आरोग्य सल्ला',
      seasonal: 'हंगामी आरोग्य मार्गदर्शक',
      seasonalSub: 'तुमच्या पशुधनासाठी नवीनतम रोग प्रतिबंधक टिप्स तपासा.'
    }
  };

  const t = translations[lang];

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

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? (lang === 'en' ? 'morning' : 'प्रभात') : hour < 17 ? (lang === 'en' ? 'afternoon' : 'दुपार') : (lang === 'en' ? 'evening' : 'संध्याकाळ');

  return (
    <Layout title="Farmer Dashboard">
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '4px 12px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Languages size={16} color="#2E7D32" style={{ marginRight: '8px' }} />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: 'bold', color: '#2E7D32' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>

        <div className="greeting-section" style={{ background: 'linear-gradient(135deg, #43A047, #2E7D32)', color: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' }}>
          <h2 className="greeting-text" style={{ color: 'white', margin: 0 }}>{t.greet} {timeOfDay}, {user?.name || user?.username}</h2>
          <p className="greeting-sub" style={{ color: '#E8F5E9', marginTop: '8px', fontSize: '16px' }}>{t.sub}</p>
        </div>

        <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/farmer/report')} style={{ boxShadow: '0 4px 12px rgba(46,125,50,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ClipboardList size={22} /> {t.report}
          </div>
        </button>

        <section className="section">
          <h3 className="section-title">{t.recent}</h3>
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ClipboardList size={48} color="#9E9E9E" /></div>
              <p>{t.noReports}</p>
            </div>
          ) : (
            <div className="report-list">
              {reports.slice(0, 5).map((report, idx) => (
                <div key={report.id || report.local_id || idx} className="report-card card" onClick={() => navigate('/farmer/report/' + (report.id || report.local_id))}>
                  <div className="report-header">
                    <strong className="report-syndrome">{report.syndrome || report.disease || 'Unknown'}</strong>
                    <PipelineTag status={report.status || 'REPORT'} />
                  </div>
                  <div className="report-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} className="report-species" />
                      <span className="report-village">{report.village || 'Unknown location'}</span>
                    </div>
                    <span className="report-species">— {report.species || 'Animal'}</span>
                  </div>
                  <div className="report-footer">
                    <span className="report-date">{new Date(report.capturedAt || report.captured_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <h3 className="section-title">{t.advisory}</h3>
          <div className="advisory-card card" onClick={() => navigate('/farmer/advisory')}>
            <div className="advisory-link-icon"><BookOpen size={24} color="#2E7D32" /></div>
            <div className="advisory-content">
              <strong>{t.seasonal}</strong>
              <p>{t.seasonalSub}</p>
            </div>
            <span className="advisory-arrow">›</span>
          </div>
        </section>
      </div>
    </Layout>
  );
}