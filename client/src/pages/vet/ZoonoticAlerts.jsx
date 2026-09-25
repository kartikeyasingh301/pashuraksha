import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { apiGet } from '../../api/client.js';
import { AlertTriangle, ShieldAlert, Activity, Users, MapPin, Syringe, Biohazard, ArrowRight, Shield } from 'lucide-react';

const ZOONOTIC_DISEASES = ['Rabies', 'Anthrax', 'Brucellosis'];

const PATHOGEN_DB = {
  Rabies: {
    transmission: 95,
    mortality: 99,
    incubation: '20-90 Days',
    oneHealthProtocol: 'Mandatory PEP within 24h. Post-exposure dog isolation.',
    humanThreat: 'CRITICAL',
    vector: 'Saliva / Bites'
  },
  Anthrax: {
    transmission: 75,
    mortality: 80,
    incubation: '1-7 Days',
    oneHealthProtocol: 'Strict Carcass Disposal. No post-mortem. Immediate ABX.',
    humanThreat: 'SEVERE',
    vector: 'Spores / Carcass handling'
  },
  Brucellosis: {
    transmission: 60,
    mortality: 5,
    incubation: '2-4 Weeks',
    oneHealthProtocol: 'Pasteurize milk. Culling of seropositive reactors.',
    humanThreat: 'MODERATE',
    vector: 'Raw Milk / Fluids'
  }
};

export default function ZoonoticAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await apiGet('/alerts');
        setAlerts(data.zoonotic || []);
      } catch (err) {}
      finally { setLoading(false); }
    }
    fetchAlerts();
  }, []);

  function getDiseaseSummary(disease) {
    const matching = alerts.filter((a) => (a.syndrome || a.disease) === disease);
    const lastVillage = matching.length > 0 ? matching[matching.length - 1].village : 'None';
    const district = matching.length > 0 ? matching[matching.length - 1].district : '';
    const isEmerging = matching.length > 0;
    return { count: matching.length, lastVillage, district, isEmerging };
  }

  return (
    <Layout title='Zoonotic Intelligence' showBack>
      <div className='page-content' style={{ paddingBottom: '100px' }}>
        
        {/* ONE HEALTH INTEGRATION BANNER */}
        <div style={{ background: '#2E7D32', color: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 4px 12px rgba(46,125,50,0.2)' }}>
          <ShieldAlert size={32} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.9 }}>One-Health Synchronization Active</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>MoHFW & DAHD Data Link</h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.4' }}>Zoonotic spillover events detected here are instantly bridged to the Ministry of Health and Family Welfare for human risk mitigation.</p>
          </div>
        </div>

        {loading ? (
           <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Scanning Zoonotic Pathogens...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {ZOONOTIC_DISEASES.map((disease) => {
              const { count, lastVillage, district, isEmerging } = getDiseaseSummary(disease);
              const db = PATHOGEN_DB[disease];
              
              return (
                <div key={disease} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${isEmerging ? '#D32F2F' : '#eee'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  
                  {/* Header Row */}
                  <div style={{ padding: '16px', background: isEmerging ? '#FFEBEE' : '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: isEmerging ? '#D32F2F' : '#9E9E9E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                         <Biohazard size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#333' }}>{disease}</h3>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: isEmerging ? '#C62828' : '#757575', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           {isEmerging ? <><Activity size={12}/> ACTIVE SPILLOVER THREAT</> : <><Shield size={12}/> CONTAINED</>}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '24px', fontWeight: '900', color: isEmerging ? '#D32F2F' : '#9E9E9E' }}>{count}</div>
                       <div style={{ fontSize: '10px', fontWeight: '700', color: '#757575', textTransform: 'uppercase' }}>Live Reports</div>
                    </div>
                  </div>

                  {/* Pathogen Threat Matrix */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                       <div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '4px' }}>
                           <span>Human Transmission Risk</span>
                           <span style={{ color: '#D32F2F' }}>{db.transmission}%</span>
                         </div>
                         <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${db.transmission}%`, height: '100%', background: '#D32F2F' }}></div>
                         </div>
                       </div>
                       <div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '4px' }}>
                           <span>Case Fatality Rate (CFR)</span>
                           <span style={{ color: '#C62828' }}>{db.mortality}%</span>
                         </div>
                         <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${db.mortality}%`, height: '100%', background: '#C62828' }}></div>
                         </div>
                       </div>
                    </div>

                    {/* Operational Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                       <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                          <div style={{ fontSize: '10px', color: '#757575', fontWeight: '700', textTransform: 'uppercase' }}>Primary Vector</div>
                          <div style={{ fontSize: '13px', color: '#333', fontWeight: '600', marginTop: '2px' }}>{db.vector}</div>
                       </div>
                       <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                          <div style={{ fontSize: '10px', color: '#757575', fontWeight: '700', textTransform: 'uppercase' }}>Incubation Period</div>
                          <div style={{ fontSize: '13px', color: '#333', fontWeight: '600', marginTop: '2px' }}>{db.incubation}</div>
                       </div>
                    </div>

                    {/* One Health Protocol */}
                    <div style={{ background: '#FFF3E0', border: '1px solid #FFE082', borderRadius: '8px', padding: '12px' }}>
                       <div style={{ fontSize: '11px', fontWeight: '800', color: '#E65100', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <Users size={14} /> Govt. Action Protocol
                       </div>
                       <div style={{ fontSize: '13px', color: '#BF360C', fontWeight: '600' }}>
                         {db.oneHealthProtocol}
                       </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isEmerging && (
                    <div style={{ padding: '12px 16px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#D32F2F" /> Last seen: <strong>{lastVillage}, {district}</strong>
                       </div>
                       <button style={{ background: '#D32F2F', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          NOTIFY HEALTH DEPT <ArrowRight size={14} />
                       </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
