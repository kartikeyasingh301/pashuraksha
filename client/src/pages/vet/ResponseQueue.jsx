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
import { CheckCircle, Clock, ActivitySquare, ShieldAlert, ChevronRight, CheckSquare } from 'lucide-react';

export default function ResponseQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet('/cases');
        const queueItems = (res.cases || []).sort((a,b) => (b.sentinel?.signal_score || 0) - (a.sentinel?.signal_score || 0));
        setItems(queueItems);
      } catch(e) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = filter === 'ALL' ? items : items.filter(i => i.sentinel?.risk_level === filter);

  return (
    <Layout title="Response Queue" showBack>
      <div className="page-content" style={{ paddingBottom: "100px" }}>
        
        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "8px" }}>
           {['ALL', 'CRITICAL', 'HIGH', 'ROUTINE'].map(f => (
             <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "12px", whiteSpace: "nowrap", cursor: "pointer",
                border: filter === f ? "none" : "1px solid #ccc",
                background: filter === f ? "#1B5E20" : "white", color: filter === f ? "white" : "#666"
             }}>{f}</button>
           ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading queue...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "12px", border: "1px solid #eee", color: "#666" }}>
            <CheckSquare size={48} color="#e0e0e0" style={{ margin: "0 auto 16px" }}/>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#333" }}>Queue is Clear</div>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>Your response queue has no pending items for this filter.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
             {filtered.map(item => (
                <div key={item.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                   <div style={{ padding: "16px", borderLeft: `6px solid ${item.sentinel?.risk_level === 'CRITICAL' ? '#C62828' : item.sentinel?.risk_level === 'HIGH' ? '#F57C00' : '#4CAF50'}` }}>
                     
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "800", color: "#666", letterSpacing: "1px", marginBottom: "4px" }}>
                             {item.sentinel?.risk_level} PRIORITY - {item.status || 'NEW'}
                          </div>
                          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#333" }}>{item.syndrome} — {item.species}</h3>
                          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666" }}>{item.village}, {item.district}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "18px", fontWeight: "800", color: "#1B5E20" }}>{item.sentinel?.signal_score}</div>
                          <div style={{ fontSize: "10px", color: "#888", fontWeight: "700", textTransform: "uppercase" }}>Priority</div>
                        </div>
                     </div>

                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "12px", background: "#f5f5f5", padding: "4px 8px", borderRadius: "4px", color: "#444" }}>Reports: {item.report_count || 1}</span>
                        <span style={{ fontSize: "12px", background: item.sentinel?.sla_state === 'SAFE' ? "#E8F5E9" : "#FFEBEE", color: item.sentinel?.sla_state === 'SAFE' ? "#2E7D32" : "#C62828", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                           <Clock size={12}/> {formatSLA(item.sentinel?.sla_hours_remaining)}
                        </span>
                        <span style={{ fontSize: "12px", background: "#E3F2FD", color: "#1565C0", padding: "4px 8px", borderRadius: "4px" }}>Assignee: Unassigned</span>
                     </div>

                     <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => navigate(`/vet/case/${item.case_id || item.id}`)} style={{ flex: 1, padding: "10px", background: "#1B5E20", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                           <ChevronRight size={16} /> OPEN CASE
                        </button>
                        <button style={{ flex: 1, padding: "10px", background: "white", color: "#1B5E20", border: "1px solid #1B5E20", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                           ASSIGN
                        </button>
                     </div>

                   </div>
                </div>
             ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
