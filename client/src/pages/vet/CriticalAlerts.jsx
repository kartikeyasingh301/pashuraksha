import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';

function formatSLA(hours) {
  if (hours === undefined || hours === null) return "SLA: Not set";
  if (hours < 0) return `SLA BREACHED (${Math.abs(hours)}h overdue)`;
  if (hours < 12) return `SLA AT RISK (${hours}h remaining)`;
  return `SLA ON TRACK (${hours}h remaining)`;
}

import { apiGet } from '../../api/client.js';
import { ShieldAlert, Activity, Filter, MapPin, ChevronRight, ActivitySquare, Shield, Clock } from 'lucide-react';

function OutbreakDNAModal({ item, onClose, onAction }) {
  if (!item) return null;
  const dna = item.sentinel?.outbreak_dna || { clinical: 50, temporal: 50, spatial: 50, preventive: 50, movement: 50, historical: 50 };
  const actions = item.sentinel?.next_best_actions || [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "flex-end", padding: "0" }}>
      <div style={{ background: "white", width: "100%", maxWidth: "600px", height: "85vh", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "20px", background: item.sentinel?.risk_level === 'CRITICAL' ? "#D32F2F" : "#F57C00", color: "white", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
           <div>
             <div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", opacity: 0.9, textTransform: "uppercase" }}>PASHURAKSHA SENTINEL</div>
             <h2 style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800" }}>{item.syndrome} — {item.district || 'Location'}</h2>
             <p style={{ margin: "4px 0 0 0", fontSize: "14px", opacity: 0.9 }}>Early Signal Score: {item.sentinel?.signal_score}/100 | Risk: {item.sentinel?.risk_level}</p>
           </div>
           <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "16px", fontSize: "18px", cursor: "pointer" }}>&times;</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f8f9fa" }}>
          
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>Signal Contributors</h3>
            {[
              { label: "Clinical Compatibility", val: dna.clinical },
              { label: "Rapid Case Growth", val: dna.temporal },
              { label: "Spatial Clustering", val: dna.spatial },
              { label: "Vaccination Gap", val: dna.preventive },
              { label: "Movement/Exposure Link", val: dna.movement },
              { label: "Historical Similarity", val: dna.historical }
            ].map(row => (
               <div key={row.label} style={{ marginBottom: "12px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "4px" }}>
                   <span>{row.label}</span>
                   <span>{row.val}%</span>
                 </div>
                 <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                   <div style={{ width: `${row.val}%`, height: "100%", background: row.val > 75 ? "#D32F2F" : row.val > 50 ? "#F57C00" : "#4CAF50" }}></div>
                 </div>
               </div>
            ))}
          </div>

          <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "20px" }}>
             
            <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "20px" }}>
               <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>Report Source Mix</h3>
               <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1, background: "#E3F2FD", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#1565C0" }}>7</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#1565C0" }}>APP</div>
                  </div>
                  <div style={{ flex: 1, background: "#F3E5F5", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#7B1FA2" }}>3</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#7B1FA2" }}>VOICE</div>
                  </div>
                  <div style={{ flex: 1, background: "#FFF3E0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                     <div style={{ fontSize: "20px", fontWeight: "800", color: "#E65100" }}>2</div>
                     <div style={{ fontSize: "11px", fontWeight: "700", color: "#E65100" }}>IVR</div>
                  </div>
               </div>
            </div>


            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>System Interpretation</h3>
             <ul style={{ margin: 0, paddingLeft: "20px", color: "#333", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
               {item.sentinel?.reasons?.map((r, idx) => <li key={idx}>{r}</li>)}
             </ul>
          </div>

          <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
             <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "800", color: "#333", textTransform: "uppercase" }}>Next Best Action</h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
               {actions.map((act, idx) => (
                 <div key={idx} style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px", borderLeft: `4px solid ${idx === 0 ? '#1B5E20' : '#ccc'}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "14px", color: "#333" }}>{idx + 1}. {act.action}</strong>
                    </div>
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Reason: {act.reason}</div>
                 </div>
               ))}
             </div>
          </div>

        </div>
        
        {/* Footer Actions */}
        <div style={{ padding: "16px 20px", background: "white", borderTop: "1px solid #eee", display: "flex", gap: "12px" }}>
           <button onClick={() => onAction(item.case_id || item.id)} style={{ flex: 1, padding: "14px", background: "#1B5E20", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>Open Case Workspace</button>
        </div>
      </div>
    </div>
  );
}

export default function CriticalAlerts() {
  const [data, setData] = useState({ critical: [], emerging: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedDNA, setSelectedDNA] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet('/alerts');
        setData({
          critical: [...(res.critical?.outbreaks || []), ...(res.critical?.cases || [])],
          emerging: res.emerging || []
        });
      } catch(e) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const allItems = [...data.critical, ...data.emerging].sort((a,b) => (b.sentinel?.signal_score || 0) - (a.sentinel?.signal_score || 0));
  const filtered = filter === 'ALL' ? allItems : filter === 'CRITICAL' ? allItems.filter(i => i.sentinel?.risk_level === 'CRITICAL') : allItems.filter(i => i.sentinel?.risk_level === 'HIGH');

  return (
    <Layout title="Triage Center" showBack>
      <div className="page-content" style={{ paddingBottom: "100px" }}>
        
        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "8px" }}>
           {['ALL', 'CRITICAL', 'EMERGING SIGNALS'].map(f => (
             <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "12px", whiteSpace: "nowrap", cursor: "pointer",
                border: filter === f ? "none" : "1px solid #ccc",
                background: filter === f ? "#1B5E20" : "white", color: filter === f ? "white" : "#666"
             }}>{f}</button>
           ))}
        </div>

        {/* List */}
        {loading ? (
           <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Scanning signals...</div>
        ) : filtered.length === 0 ? (
           <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "12px", border: "1px solid #eee", color: "#666" }}>
              <Shield size={48} color="#e0e0e0" style={{ margin: "0 auto 16px" }}/>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#333" }}>No active alerts</div>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>All monitored cases are currently below the critical threshold.</p>
           </div>
        ) : (
           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((item, idx) => {
                 const isCrit = item.sentinel?.risk_level === 'CRITICAL';
                 return (
                   <div key={`${item.id}-${idx}`} style={{ background: "white", borderRadius: "12px", border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                      <div style={{ padding: "16px", borderLeft: `6px solid ${isCrit ? '#D32F2F' : '#F57C00'}` }}>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                               <div style={{ fontSize: "11px", fontWeight: "800", color: isCrit ? '#D32F2F' : '#F57C00', letterSpacing: "1px", marginBottom: "4px" }}>{isCrit ? 'CRITICAL PRIORITY' : 'HIGH PRIORITY'}</div>
                               <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#333" }}>{item.syndrome} — {item.species || 'Animals'}</h3>
                               <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14}/> {item.cluster_label || item.village || ''} {item.district}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                               <div style={{ fontSize: "20px", fontWeight: "800", color: "#333" }}>{item.sentinel?.signal_score}</div>
                               <div style={{ fontSize: "10px", color: "#888", fontWeight: "700", textTransform: "uppercase" }}>Signal Score</div>
                            </div>
                         </div>

                         <div style={{ display: "flex", gap: "16px", marginBottom: "16px", background: "#f8f9fa", padding: "12px", borderRadius: "8px" }}>
                            <div>
                              <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>Reports</div>
                              <div style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>{item.report_count || 1}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>SLA</div>
                              <div style={{ fontSize: "15px", fontWeight: "700", color: item.sentinel?.sla_state === 'SAFE' ? '#2E7D32' : '#C62828', display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={14}/> {item.sentinel?.sla_hours_remaining}h
                              </div>
                            </div>
                         </div>

                         <div style={{ fontSize: "13px", color: "#444", marginBottom: "16px" }}>
                           <span style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", marginRight: "8px" }}>Source Mix: APP/VOICE/IVR</span>
                             <strong>Why flagged:</strong> {item.sentinel?.reasons?.[0]}
                         </div>

                         <button onClick={() => setSelectedDNA(item)} style={{ width: "100%", padding: "12px", background: "white", color: "#1565C0", border: "2px solid #1565C0", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                            <ActivitySquare size={18} />
                            OPEN INTELLIGENCE
                         </button>
                      </div>
                   </div>
                 );
              })}
           </div>
        )}

        {selectedDNA && (
           <OutbreakDNAModal item={selectedDNA} onClose={() => setSelectedDNA(null)} onAction={(id) => navigate(`/vet/case/${id}`)} />
        )}

      </div>
    </Layout>
  );
}
