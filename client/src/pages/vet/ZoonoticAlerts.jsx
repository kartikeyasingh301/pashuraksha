import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { apiGet } from '../../api/client.js';

const ZOONOTIC_DISEASES = ['Rabies', 'Anthrax', 'Brucellosis'];

const DISEASE_INFO = {
  Rabies: {
    icon: '🐕',
    riskColor: '#C62828',
    advisory: 'Rabies is fatal once symptomatic. All dog bites must be treated as rabies-suspect. Ensure pre-exposure vaccination of veterinary staff. Report any animal showing abnormal aggression or neurological signs immediately. Post-exposure prophylaxis must be administered within 24 hours of bite.',
  },
  Anthrax: {
    icon: '⚠️',
    riskColor: '#C62828',
    advisory: 'Anthrax (Bacillus anthracis) can infect humans through contact with infected animals or carcasses. DO NOT handle carcasses without full PPE. Annual spore vaccination is critical in endemic zones. Report sudden animal deaths to district veterinary officer immediately.',
  },
  Brucellosis: {
    icon: '🧬',
    riskColor: '#AD1457',
    advisory: 'Brucellosis causes undulant fever in humans via contact with infected animals or consumption of raw milk. Test and vaccinate cattle and buffalo. Pasteurize all milk. Veterinary staff handling abortions must use gloves and protective gear. Vaccinate female calves aged 4-8 months.',
  },
};

export default function ZoonoticAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await apiGet('/alerts');
        const all = data.alerts || data || [];
        setAlerts(all.filter((a) => ZOONOTIC_DISEASES.includes(a.syndrome || a.disease)));
      } catch (err) { setError(err.message || 'Failed to load zoonotic alerts'); }
      finally { setLoading(false); }
    }
    fetchAlerts();
  }, []);

  function getDiseaseSummary(disease) {
    const matching = alerts.filter((a) => (a.syndrome || a.disease) === disease);
    const lastVillage = matching.length > 0 ? matching[matching.length - 1].village : 'None';
    const risk = matching.length >= 3 ? 'HIGH' : matching.length >= 1 ? 'MEDIUM' : 'LOW';
    return { count: matching.length, lastVillage, risk };
  }

  const RISK_COLORS = { HIGH: '#C62828', MEDIUM: '#F57F17', LOW: '#2E7D32' };

  return (
    <Layout title='Zoonotic Alerts' showBack>
      <div className='page-content'>
        <p className='page-desc'>Diseases that can spread from animals to humans. Requires immediate public health coordination.</p>
        {error && <div className='alert alert-error'>{error}</div>}
        {loading ? <div className='loading-state'>Loading zoonotic data...</div> : (
          <div className='zoonotic-list'>
            {ZOONOTIC_DISEASES.map((disease) => {
              const { count, lastVillage, risk } = getDiseaseSummary(disease);
              const info = DISEASE_INFO[disease];
              return (
                <div key={disease} className='zoonotic-card card' style={{ borderLeft: '4px solid ' + info.riskColor }}>
                  <div className='zoonotic-header'>
                    <span className='zoonotic-icon'>{info.icon}</span>
                    <div className='zoonotic-title-group'>
                      <h3 className='zoonotic-disease'>{disease}</h3>
                      <span className='zoonotic-risk' style={{ color: RISK_COLORS[risk] }}>Risk: {risk}</span>
                    </div>
                  </div>
                  <div className='zoonotic-stats'>
                    <span>Reports: <strong>{count}</strong></span>
                    <span>Last reported: <strong>{lastVillage}</strong></span>
                  </div>
                  <p className='zoonotic-advisory'>{info.advisory}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
