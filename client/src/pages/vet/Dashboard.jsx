import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

const NAV_CARDS = [
  { to: '/vet/alerts', icon: '🚨', label: 'Critical Alerts', color: '#C62828', desc: 'View critical cases and outbreaks' },
  { to: '/vet/clusters', icon: '🔴', label: 'Emerging Clusters', color: '#E65100', desc: 'Spatiotemporal disease clusters' },
  { to: '/vet/queue', icon: '📋', label: 'Response Queue', color: '#1565C0', desc: 'Pending field responses' },
  { to: '/vet/map', icon: '🗺️', label: 'Map View', color: '#2E7D32', desc: 'Geographic incident overview' },
  { to: '/vet/vaccination', icon: '💉', label: 'Vaccination Gaps', color: '#6A1B9A', desc: 'Coverage analysis by village' },
  { to: '/vet/zoonotic', icon: '🧬', label: 'Zoonotic Alerts', color: '#AD1457', desc: 'Human health risk notifications' },
  { to: '/vet/lab', icon: '🔬', label: 'Lab Status', color: '#00695C', desc: 'Sample results and pending tests' },
];

export default function VetDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalReports: 0, activeCases: 0, suspectedOutbreaks: 0, pendingLab: 0, criticalAlerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [alertsData, casesData] = await Promise.all([
          apiGet('/alerts').catch(() => ({ alerts: [] })),
          apiGet('/cases').catch(() => ({ cases: [] })),
        ]);
        const alerts = alertsData.alerts || alertsData || [];
        const cases = casesData.cases || casesData || [];
        setSummary({
          totalReports: cases.length,
          activeCases: cases.filter((c) => c.status === 'ACTIVE' || c.status === 'CASE').length,
          suspectedOutbreaks: alerts.filter((a) => a.severity === 'CRITICAL' || a.type === 'SUSPECTED_OUTBREAK').length,
          pendingLab: cases.filter((c) => c.labStatus === 'PENDING').length,
          criticalAlerts: alerts.filter((a) => a.severity === 'CRITICAL').length,
        });
      } catch (_) {}
      finally { setLoading(false); }
    }
    fetchSummary();
  }, []);

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout title="Vet Dashboard">
      <div className="page-content">
        <div className="greeting-section">
          <h2 className="greeting-text">{greeting}, Dr. {user?.name || user?.username} 🩺</h2>
          <p className="greeting-sub">Animal Health Surveillance Overview</p>
        </div>

        {loading ? (
          <div className="loading-state">Loading summary...</div>
        ) : (
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-num">{summary.totalReports}</div>
              <div className="summary-label">Reports Today</div>
            </div>
            <div className="summary-card">
              <div className="summary-num">{summary.activeCases}</div>
              <div className="summary-label">Active Cases</div>
            </div>
            <div className={summary-card }>
              <div className="summary-num">{summary.suspectedOutbreaks}</div>
              <div className="summary-label">Suspected Outbreaks</div>
            </div>
            <div className="summary-card">
              <div className="summary-num">{summary.pendingLab}</div>
              <div className="summary-label">Pending Lab</div>
            </div>
          </div>
        )}

        <div className="nav-cards-grid">
          {NAV_CARDS.map((card) => (
            <div key={card.to} className="nav-card card" onClick={() => navigate(card.to)} style={{ cursor: 'pointer' }}>
              <div className="nav-card-icon" style={{ color: card.color }}>{card.icon}</div>
              <div className="nav-card-label">{card.label}</div>
              <div className="nav-card-desc">{card.desc}</div>
              {card.to === '/vet/alerts' && summary.criticalAlerts > 0 && (
                <span className="alert-count-badge">{summary.criticalAlerts}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}