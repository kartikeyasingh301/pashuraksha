import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { apiGet } from '../../api/client.js';

function getCoverageColor(pct) {
  if (pct < 30) return '#C62828';
  if (pct < 60) return '#F57F17';
  return '#2E7D32';
}

export default function VaccinationGap() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function fetchGaps() {
      try {
        const data = await apiGet('/vaccination/gaps');
        const all = data.gaps || data || [];
        const sorted = all.sort((a, b) => {
          const pctA = a.total ? (a.vaccinated / a.total) * 100 : 0;
          const pctB = b.total ? (b.vaccinated / b.total) * 100 : 0;
          return pctA - pctB;
        });
        setGaps(sorted);
      } catch (err) { setError(err.message || 'Failed to load vaccination data'); }
      finally { setLoading(false); }
    }
    fetchGaps();
  }, []);

  function handlePlanDrive(gap) {
    setToast('Vaccination drive planned for ' + gap.village + ' (' + gap.species + ')');
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <Layout title='Vaccination Gaps' showBack>
      <div className='page-content'>
        {toast && <div className='alert alert-success'>{toast}</div>}
        {error && <div className='alert alert-error'>{error}</div>}
        {loading ? <div className='loading-state'>Loading vaccination data...</div> : gaps.length === 0 ? (
          <div className='empty-state'><p>No vaccination gap data available.</p></div>
        ) : (
          <div className='vax-gap-list'>
            {gaps.map((gap, idx) => {
              const pct = gap.total ? Math.round((gap.vaccinated / gap.total) * 100) : 0;
              const color = getCoverageColor(pct);
              return (
                <div key={idx} className='vax-gap-card card'>
                  <div className='vax-gap-header'>
                    <div>
                      <strong>{gap.village || 'Unknown Village'}</strong>
                      <span className='vax-species'> — {gap.species || 'Cattle'}</span>
                    </div>
                    <span className='vax-pct' style={{ color }}>{pct}%</span>
                  </div>
                  <div className='vax-progress-bar'>
                    <div className='vax-progress-fill' style={{ width: pct + '%', background: color }} />
                  </div>
                  <div className='vax-gap-meta'>
                    <span>Vaccinated: {gap.vaccinated || 0}</span>
                    <span>Total: {gap.total || 0}</span>
                    <span>Unvaccinated: {(gap.total || 0) - (gap.vaccinated || 0)}</span>
                  </div>
                  <button className='btn btn-outline btn-sm' onClick={() => handlePlanDrive(gap)}>💉 Plan Vaccination Drive</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
