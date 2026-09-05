import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, BookOpen } from 'lucide-react';
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

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout title="Farmer Dashboard">
      <div className="page-content">
        <div className="greeting-section">
          <h2 className="greeting-text">{greeting}, {user?.name || user?.username}</h2>
          <p className="greeting-sub">How are your animals doing today?</p>
        </div>

        <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/farmer/report')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ClipboardList size={20} /> Report Animal Health Issue
          </div>
        </button>

        <section className="section">
          <h3 className="section-title">Your Recent Reports</h3>
          {loading ? (
            <div className="loading-state">Loading your reports...</div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ClipboardList size={48} color="#9E9E9E" /></div>
              <p>No reports yet. Submit your first report!</p>
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
          <h3 className="section-title">Health Advisories</h3>
          <div className="advisory-card card" onClick={() => navigate('/farmer/advisory')}>
            <div className="advisory-link-icon"><BookOpen size={24} color="#2E7D32" /></div>
            <div className="advisory-content">
              <strong>Seasonal Health Guide</strong>
              <p>Check the latest disease prevention tips for your livestock.</p>
            </div>
            <span className="advisory-arrow">›</span>
          </div>
        </section>
      </div>
    </Layout>
  );
}