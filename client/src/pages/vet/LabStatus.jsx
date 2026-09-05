import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { apiGet } from '../../api/client.js';
import { Microscope } from 'lucide-react';

const STATUS_META = {
  PENDING:   { color: '#757575', label: 'Pending' },
  IN_LAB:    { color: '#1976D2', label: 'In Lab' },
  RESULTED:  { color: '#2E7D32', label: 'Resulted' },
  CONFIRMED: { color: '#1B5E20', label: 'Confirmed' },
};

export default function LabStatus() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLab() {
      try {
        const data = await apiGet('/lab');
        setSamples(data.samples || data || []);
      } catch (err) { setError(err.message || 'Failed to load lab data'); }
      finally { setLoading(false); }
    }
    fetchLab();
  }, []);

  return (
    <Layout title='Lab Status' showBack>
      <div className='page-content'>
        {error && <div className='alert alert-error'>{error}</div>}
        {loading ? <div className='loading-state'>Loading lab results...</div> : samples.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>🔬</div>
            <p>No lab samples found. Samples will appear here once submitted.</p>
          </div>
        ) : (
          <div className='lab-table-wrap'>
            <table className='lab-table'>
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Disease</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s, idx) => {
                  const meta = STATUS_META[s.status] || STATUS_META.PENDING;
                  return (
                    <tr key={s.id || idx}>
                      <td><code>{s.sampleId || s.id || ('S-' + idx)}</code></td>
                      <td>{s.syndrome || s.disease || 'N/A'}</td>
                      <td>{s.sampleType || 'Blood'}</td>
                      <td>{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                      <td><span className='lab-status-badge' style={{ background: meta.color + '22', color: meta.color, border: '1px solid ' + meta.color }}>{meta.label}</span></td>
                      <td>{s.result || <span className='muted'>Awaiting</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
