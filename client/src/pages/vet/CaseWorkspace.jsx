import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { apiGet, apiPost } from '../../api/client.js';
import { ShieldAlert, MapPin, Activity, CheckCircle, Clock, ChevronRight, FileText, FlaskConical, Users, Crosshair } from 'lucide-react';

export default function CaseWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callState, setCallState] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet(`/cases/${id}`);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Layout title="Case Workspace" showBack><div style={{ padding: "40px", textAlign: "center" }}>Loading Case Intelligence...</div></Layout>;
  if (!data || !data.case) return <Layout title="Case Workspace" showBack><div style={{ padding: "40px", textAlign: "center" }}>Case not found.</div></Layout>;

  const c = data.case;
  const isCrit = c.sentinel?.risk_level === 'CRITICAL';
  
  const cardStyle = { background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "16px", marginBottom: "16px" };

  return (
    <Layout title={`Case ${id}`} showBack>
      <div className="page-content" style={{ paddingBottom: "100px" }}>
        
        {/* HEADER */}
        <div style={{ ...cardStyle, borderLeft: `6px solid ${isCrit ? '#D32F2F' : '#F57C00'}`, background: isCrit ? '#FFEBEE' : '#FFF8E1', borderColor: isCrit ? '#FFCDD2' : '#FFECB3' }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#333" }}>{c.syndrome} — Suspected</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#555", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={16}/> {c.village}, {c.district}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: isCrit ? '#D32F2F' : '#F57C00' }}>{c.sentinel?.signal_score}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", textTransform: "uppercase" }}>Signal</div>
              </div>
           </div>
           
           <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
             <div style={{ background: "white", padding: "8px 12px", borderRadius: "8px", flex: 1, border: "1px solid rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>AFFECTED</div>
               <div style={{ fontSize: "16px", fontWeight: "700" }}>{data.reports?.length * 4 || 12} est.</div>
             </div>
             <div style={{ background: "white", padding: "8px 12px", borderRadius: "8px", flex: 1, border: "1px solid rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>MORTALITY</div>
               <div style={{ fontSize: "16px", fontWeight: "700", color: "#D32F2F" }}>{data.reports?.reduce((acc, r) => acc + (r.mortality_count || 0), 0) || 0}</div>
             </div>
           </div>
        </div>

        {/* TIMELINE */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#333", margin: "0 0 16px 0", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}><Clock size={18}/> Case Timeline</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
             <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                   <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#4CAF50", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={12}/></div>
                   <div style={{ width: "2px", height: "30px", background: "#4CAF50" }}></div>
                </div>
                <div>
                   <div style={{ fontSize: "14px", fontWeight: "700" }}>Farmer Report Received</div>
                   <div style={{ fontSize: "12px", color: "#666" }}>{new Date(c.created_at || Date.now()).toLocaleString()}</div>
                </div>
             </div>
             <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                   <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#4CAF50", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={12}/></div>
                   <div style={{ width: "2px", height: "30px", background: "#e0e0e0" }}></div>
                </div>
                <div>
                   <div style={{ fontSize: "14px", fontWeight: "700" }}>Sentinel Triage Complete</div>
                   <div style={{ fontSize: "12px", color: "#666" }}>Risk Level: {c.sentinel?.risk_level}</div>
                </div>
             </div>
             <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                   <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #F57C00", background: "white" }}></div>
                </div>
                <div>
                   <div style={{ fontSize: "14px", fontWeight: "700", color: "#F57C00" }}>Pending Vet Response</div>
                   <div style={{ fontSize: "12px", color: "#666" }}>SLA Remaining: {c.sentinel?.sla_hours_remaining}h</div>
                </div>
             </div>
          </div>
        </div>

        
        {/* VOICE EVIDENCE (If source is Voice) */}
        {hasVoice && (
          <div style={{ ...cardStyle, background: "#F3E5F5", borderColor: "#E1BEE7" }}>
             <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#4A148C", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
               <Mic size={16} /> Original Voice Report
             </h3>
             <div style={{ background: "white", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <button style={{ background: "#7B1FA2", border: "none", color: "white", width: "40px", height: "40px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Play size={16} fill="white" /></button>
                <div style={{ flex: 1 }}>
                  <div style={{ background: "#eee", height: "4px", borderRadius: "2px", width: "100%", position: "relative" }}>
                     <div style={{ background: "#7B1FA2", height: "4px", borderRadius: "2px", width: "30%" }}></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666", marginTop: "4px" }}>
                     <span>00:04</span><span>00:14</span>
                  </div>
                </div>
             </div>
             <div style={{ background: "white", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#333", border: "1px solid rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: "11px", color: "#666", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase" }}>Transcription</div>
               "My cow has fever and blisters. It is having difficulty walking. Two other cows also look sick."
             </div>
          </div>
        )}
    
        {/* WHY FLAGGED */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#333", margin: "0 0 12px 0", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}><Activity size={18}/> Outbreak Context</h3>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#333", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {c.sentinel?.reasons?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          
          <div style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
             <Users size={24} color="#1565C0" />
             <div>
               <div style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>RELATED REPORTS</div>
               <div style={{ fontSize: "14px", fontWeight: "700" }}>{data.reports?.length || 0} matching cases in 10km radius</div>
             </div>
          </div>
        </div>

        {/* NEXT BEST ACTIONS */}
        <div style={{ ...cardStyle, border: "2px solid #1B5E20" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#1B5E20", margin: "0 0 16px 0", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}><Crosshair size={18}/> Recommended Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {c.sentinel?.next_best_actions?.map((act, i) => (
              <div key={i} style={{ padding: "16px", background: i === 0 ? "#E8F5E9" : "#f8f9fa", borderRadius: "8px", border: i === 0 ? "1px solid #C8E6C9" : "1px solid #eee" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <strong style={{ fontSize: "15px", color: i === 0 ? "#1B5E20" : "#333" }}>{act.action}</strong>
                     <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>{act.reason}</div>
                   </div>
                   <button style={{ padding: "8px 16px", background: i === 0 ? "#1B5E20" : "white", color: i === 0 ? "white" : "#333", border: i === 0 ? "none" : "1px solid #ccc", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
                     {act.type}
                   </button>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
