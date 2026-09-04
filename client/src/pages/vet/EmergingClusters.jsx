import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { apiGet } from '../../api/client.js';

export default function EmergingClusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchClusters() {
      try {
        const data = await apiGet('/clusters');
        setClusters(data.clusters || data || []);
      } catch (err) {
        setError(err.message || 'Failed to load clusters');
      } finally {
        setLoading(false);
      }
    }
    fetchClusters();
  }, []);

  return (
    <Layout title="Emerging Clusters" showBack>
      <div className="page-content">
        <p className="page-desc">Spatiotemporal clusters of disease reports detected by the surveillance algorithm.</p>
        {error && <div className="alert alert-error">{error}</div>}
        {loading ? (
          <div className="loading-state">Analyzing clusters...</div>
        ) : clusters.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔴</div>
            <p>No emerging clusters detected at this time.</p>
          </div>
        ) : (
          <div className="cluster-list">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="cluster-card card">
                <div className="cluster-header">
                  <div>
                    <strong className="cluster-label">{cluster.label || 'Cluster ' + cluster.id}</strong>
                    <div className="cluster-syndrome">{cluster.syndrome || 'Unknown'} — {cluster.species || 'Multiple'}</div>
                  </div>
                  <PipelineTag status={cluster.status || 'CLUSTER'} />
                </div>
                <div className="cluster-body">
                  <div className="cluster-meta-row">
                    <span>📊 Reports: <strong>{cluster.reportCount || cluster.count || 0}</strong></span>
                    <span>📍 Radius: <strong>{cluster.radiusKm ? cluster.radiusKm + ' km' : 'N/A'}</strong></span>
                  </div>
                  <div className="cluster-meta-row">
                    <span>🗓️ Detected: {cluster.detectedAt ? new Date(cluster.detectedAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                  </div>
                  {cluster.centerVillage && (
                    <div className="cluster-center">📍 Center: {cluster.centerVillage}, {cluster.district || ''}</div>
                  )}
                  {cluster.linkedCaseId && (
                    <div className="cluster-linked">🔗 Linked Case: <code>{cluster.linkedCaseId}</code></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}