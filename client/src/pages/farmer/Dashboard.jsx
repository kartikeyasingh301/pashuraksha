import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSyncContext } from '../../contexts/SyncContext.jsx';
import { apiGet } from '../../api/client.js';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { pendingCount } = useSyncContext();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await apiGet('/reports/my');
        setReports(data.reports || data || []);
      } catch (_) {
        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    }
    fetchReports();
  }, []);

  const recentReports = reports.slice(0, 5);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout title="Dashboard">
      <div className="page-content">
        <div className="greeting-section">
          <h2 className="greeting-text">{greeting}, {user?.name || user?.username || 'Farmer'} 👋</h2>
          <p className="greeting-sub">Monitor your animals' health</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{reports.length}</div>
            <div className="stat-label">My Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending Sync</div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-large report-cta"
          onClick={() => navigate('/farmer/report')}
        >
          📋 Report Animal Health Issue
        </button>

        <section className="section">
          <h3 className="section-title">Recent Reports</h3>
          {loadingReports ? (
            <div className="loading-state">Loading reports...</div>
          ) : recentReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No reports yet. Submit your first report!</p>
            </div>
          ) : (
            <div className="report-list">
              {recentReports.map((report, idx) => (
                <div key={report.id || idx} className="report-item card">
                  <div className="report-item-top">
                    <div className="report-item-info">
                      <strong>{report.syndrome || report.disease || 'Health Issue'}</strong>
                      <span className="report-species"> — {report.species || 'Animal'}</span>
                    </div>
                    <PipelineTag status={report.status || 'REPORT'} />
                  </div>
                  <div className="report-item-bottom">
                    <span className="report-village">📍 {report.village || 'Unknown location'}</span>
                    <span className="report-date">
                      {report.capturedAt ? new Date(report.capturedAt).toLocaleDateString('en-IN') : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="advisory-link card" onClick={() => navigate('/farmer/advisory')}>
            <div className="advisory-link-icon">📖</div>
            <div className="advisory-link-text">
              <strong>Health Advisories</strong>
              <p>Prevention tips &amp; disease alerts for Gujarat</p>
            </div>
            <span className="advisory-arrow">›</span>
          </div>
        </section>
      </div>
    </Layout>
  );
}