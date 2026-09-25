import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { apiGet } from '../../api/client.js';
import { ShieldAlert, Syringe, MapPin, Target, Truck, ChevronRight, Activity } from 'lucide-react';

function getCoverageColor(pct) {
  if (pct < 40) return { bg: '#FFEBEE', text: '#C62828', fill: '#D32F2F', label: 'CRITICAL RISK' };
  if (pct < 70) return { bg: '#FFF3E0', text: '#E65100', fill: '#F57C00', label: 'VULNERABLE' };
  return { bg: '#E8F5E9', text: '#2E7D32', fill: '#4CAF50', label: 'PROTECTED' };
}

export default function VaccinationGap() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Fallback demo data if backend returns empty (for hackathon reliability)
  const DEMO_GAPS = [
    { village: 'Gondal', district: 'Rajkot', species: 'Cattle', vaccinated: 320, total: 1150, disease: 'FMD' },
    { village: 'Upleta', district: 'Rajkot', species: 'Buffalo', vaccinated: 450, total: 800, disease: 'HS' },
    { village: 'Dhoraji', district: 'Rajkot', species: 'Sheep', vaccinated: 890, total: 1100, disease: 'PPR' }
  ];

  useEffect(() => {
    async function fetchGaps() {
      try {
        const data = await apiGet('/vaccination/gaps');
        let all = data.gaps || data || [];
        if (all.length === 0) all = DEMO_GAPS; // Fallback for demo
        
        const sorted = all.sort((a, b) => {
          const pctA = a.total ? (a.vaccinated / a.total) * 100 : 0;
          const pctB = b.total ? (b.vaccinated / b.total) * 100 : 0;
          return pctA - pctB;
        });
        setGaps(sorted);
      } catch (err) {
        setGaps(DEMO_GAPS);
      } finally { setLoading(false); }
    }
    fetchGaps();
  }, []);

  function handlePlanDrive(gap) {
    setToast(`Logistics requested: ${gap.total - gap.vaccinated} doses queued for ${gap.village}.`);
    setTimeout(() => setToast(''), 4000);
  }

  const criticalCount = gaps.filter(g => (g.vaccinated / g.total) * 100 < 40).length;

  return (
    <Layout title='Immunization Logistics' showBack>
      <div className='page-content' style={{ paddingBottom: '100px' }}>
        
        {/* Toast Notification */}
        {toast && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#2E7D32', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '14px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' }}>
            <Truck size={16}/> {toast}
          </div>
        )}

        {/* HERD IMMUNITY BANNER */}
        <div style={{ background: criticalCount > 0 ? '#D32F2F' : '#1565C0', color: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Activity size={32} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.9 }}>Herd Immunity Monitor</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>{criticalCount} Zones Below Safety Threshold</h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.4' }}>Populations with &lt;40% coverage are at extreme risk of outbreak amplification. Immediate ring vaccination required.</p>
          </div>
        </div>

        {loading ? (
           <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Analyzing spatial immunity coverage...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gaps.map((gap, idx) => {
              const pct = gap.total ? Math.round((gap.vaccinated / gap.total) * 100) : 0;
              const missing = gap.total - gap.vaccinated;
              const theme = getCoverageColor(pct);
              
              return (
                <div key={idx} style={{ background: 'white', borderRadius: '12px', border: `1px solid #eee`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  
                  {/* Header */}
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>
                        <MapPin size={14} color="#1565C0" /> {gap.village}, {gap.district || 'District'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {gap.species} <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{gap.disease || 'General'}</span>
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '24px', fontWeight: '900', color: theme.fill }}>{pct}%</div>
                       <div style={{ background: theme.bg, color: theme.text, fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                         {theme.label}
                       </div>
                    </div>
                  </div>

                  {/* Advanced Progress Bar */}
                  <div style={{ padding: '0 16px 16px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '6px' }}>
                       <span>Immunized: {gap.vaccinated}</span>
                       <span>Vulnerable: {missing}</span>
                    </div>
                    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                       <div style={{ width: `${pct}%`, height: '100%', background: theme.fill }}></div>
                       <div style={{ width: `${100 - pct}%`, height: '100%', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==) repeat' }}></div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div style={{ padding: '12px 16px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                        <Target size={14} /> Deficit: {missing} Doses
                     </div>
                     <button onClick={() => handlePlanDrive(gap)} style={{ background: 'white', color: '#1565C0', border: '1px solid #1565C0', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                        <Syringe size={14} /> DEPLOY VACCINE <ChevronRight size={14}/>
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
