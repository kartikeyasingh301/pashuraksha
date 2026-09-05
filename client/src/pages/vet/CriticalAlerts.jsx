import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { apiGet, apiPost } from '../../api/client.js';

function AlertCard({ alert, onConfirm, confirmLoading }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirmClick() {
    setShowConfirm(true);
  }

  async function handleConfirm() {
    await onConfirm(alert.id);
    setShowConfirm(false);
  }

  const isCritical = alert.severity === 'CRITICAL';
  const isOutbreak = alert.type === 'SUSPECTED_OUTBREAK' || alert.status === 'SUSPECTED_OUTBREAK';

  return (
    <div className={'alert-card card' + (isCritical ? ' alert-card-critical' : isOutbreak ? ' alert-card-outbreak' : '')}>
      <div className="alert-card-header">
        <div>
          <strong className="alert-syndrome">{alert.syndrome || alert.disease || 'Unknown Disease'}</strong>
          <span className="alert-species"> — {alert.species || 'Unknown'}</span>
        </div>
        <PipelineTag status={alert.status || (isCritical ? 'CLUSTER' : 'REPORT')} />
      </div>
      <div className="alert-card-body">
        <div className="alert-location">📍 {alert.village || alert.location || ''}{alert.district ? ', ' + alert.district : ''}</div>
        <div className="alert-meta">
          <span>Reports: <strong>{alert.reportCount || 1}</strong></span>
          <span className="alert-date">{alert.createdAt ? new Date(alert.createdAt).toLocaleDateString('en-IN') : ''}</span>
        </div>
        {alert.notes && <p className="alert-notes">{alert.notes}</p>}
      </div>

      {isOutbreak && !alert.confirmed && (
        <div className="alert-card-actions">
          {!showConfirm ? (
            <button className="btn btn-danger" onClick={handleConfirmClick}>⚠️ Confirm Outbreak</button>
          ) : (
            <div className="confirm-dialog">
              <p className="confirm-msg">Are you sure? This action is <strong>irreversible</strong> and will escalate this cluster to a confirmed outbreak.</p>
              <div className="confirm-btns">
                <button className="btn btn-danger" onClick={handleConfirm} disabled={confirmLoading}>
                  {confirmLoading ? 'Confirming...' : 'Yes, Confirm'}
                </button>
                <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CriticalAlerts() {
  const [alerts, setAlerts] = useState({ criticalCases: [], outbreaks: [], zoonotic: [] });
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await apiGet('/alerts');
        setAlerts({
          criticalCases: data.critical?.cases || [],
          outbreaks: data.critical?.outbreaks || [],
          zoonotic: data.zoonotic || []
        });
      } catch (err) {
        setError(err.message || 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  async function handleConfirmOutbreak(id) {
    setConfirmLoading(true);
    try {
      await apiPost('/outbreaks/' + id + '/confirm', {});
      setAlerts((prev) => ({
        ...prev,
        outbreaks: prev.outbreaks.map((a) => a.id === id ? { ...a, confirmed: true, status: 'CONFIRMED' } : a)
      }));
    } catch (err) {
      setError('Failed to confirm: ' + err.message);
    } finally {
      setConfirmLoading(false);
    }
  }

  const critical = alerts.criticalCases;
  const outbreaks = alerts.outbreaks;
  const zoonotic = alerts.zoonotic;

  return (
    <Layout title="Critical Alerts" showBack>
      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}
        {loading ? (
          <div className="loading-state">Loading alerts...</div>
        ) : (
          <>
            <section className="section">
              <h3 className="section-title section-critical">🚨 Critical Cases ({critical.length})</h3>
              {critical.length === 0 ? (
                <div className="empty-state"><p>No critical cases at this time.</p></div>
              ) : (
                critical.map((a) => <AlertCard key={a.id} alert={a} onConfirm={handleConfirmOutbreak} confirmLoading={confirmLoading} />)
              )}
            </section>

            <section className="section">
              <h3 className="section-title section-outbreak">🔴 Suspected Outbreaks ({outbreaks.length})</h3>
              {outbreaks.length === 0 ? (
                <div className="empty-state"><p>No suspected outbreaks detected.</p></div>
              ) : (
                outbreaks.map((a) => <AlertCard key={a.id} alert={a} onConfirm={handleConfirmOutbreak} confirmLoading={confirmLoading} />)
              )}
            </section>

            <section className="section">
              <h3 className="section-title section-zoonotic">🧬 Zoonotic Threats ({zoonotic.length})</h3>
              {zoonotic.length === 0 ? (
                <div className="empty-state"><p>No zoonotic alerts at this time.</p></div>
              ) : (
                zoonotic.map((a) => <AlertCard key={a.id} alert={a} onConfirm={handleConfirmOutbreak} confirmLoading={confirmLoading} />)
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}