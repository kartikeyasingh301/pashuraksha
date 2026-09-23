import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/client.js';
import Layout from '../../components/Layout.jsx';
import { FlaskConical, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function LabDashboard() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    async function fetchSamples() {
      try {
        const data = await apiGet('/lab');
        setSamples(data.samples || []);
      } catch (err) {
        console.error("Failed to load samples", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSamples();
  }, []);

  const handleResult = async (sampleId, result) => {
    setProcessing(sampleId);
    try {
      // In a real app, this would hit a POST /api/lab/:id/result endpoint
      // We will mock it updating locally for the demo
      setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, status: 'COMPLETED', result } : s));
      alert(`Result submitted: ${result}`);
    } catch (err) {
      alert("Failed to submit result");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Layout title="Laboratory Command Center" showBack>
      <div className="page-content" style={{ padding: '16px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: '#F3E5F5', padding: '16px', borderRadius: '12px' }}>
          <FlaskConical size={32} color="#7B1FA2" />
          <div>
            <h2 style={{ margin: 0, color: '#4A148C', fontSize: '18px' }}>Diagnostic Queue</h2>
            <div style={{ fontSize: '14px', color: '#7B1FA2', fontWeight: '500' }}>{samples.filter(s => s.status === 'PENDING').length} pending samples</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading queue...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {samples.map(sample => (
              <div key={sample.id} className="card" style={{ borderLeft: `4px solid ${sample.status === 'PENDING' ? '#F57C00' : '#4CAF50'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>Sample #{sample.id}</div>
                  <div style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: sample.status === 'PENDING' ? '#FFF3E0' : '#E8F5E9', color: sample.status === 'PENDING' ? '#E65100' : '#2E7D32', fontWeight: '600' }}>
                    {sample.status}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                  <div><strong>Type:</strong> {sample.sample_type || 'Blood Serum'}</div>
                  <div><strong>Report:</strong> {sample.report_id?.substring(0,8)}...</div>
                  <div><strong>Submitted:</strong> {new Date(sample.submitted_at || Date.now()).toLocaleDateString()}</div>
                  {sample.result && <div><strong>Result:</strong> {sample.result}</div>}
                </div>

                {sample.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      disabled={processing === sample.id}
                      onClick={() => handleResult(sample.id, 'POSITIVE')}
                      style={{ flex: 1, padding: '10px', background: '#D32F2F', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      MARK POSITIVE
                    </button>
                    <button 
                      disabled={processing === sample.id}
                      onClick={() => handleResult(sample.id, 'NEGATIVE')}
                      style={{ flex: 1, padding: '10px', background: '#388E3C', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      MARK NEGATIVE
                    </button>
                  </div>
                )}
              </div>
            ))}
            {samples.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No samples in queue.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
