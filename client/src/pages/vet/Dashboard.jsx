import { getGreeting } from '../../utils/time.js';
﻿import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity, Map as MapIcon, Dna, Timer, ShieldAlert, ChevronRight, FileText, CheckCircle, BarChart2, FlaskConical, MapPin } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

export default function VetDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [alertsData, casesData, reportsData, labData] = await Promise.all([
          apiGet('/alerts').catch(() => ({ critical: { cases: [], outbreaks: [] }, emerging: [] })),
          apiGet('/cases').catch(() => ({ cases: [] })),
          apiGet('/reports').catch(() => ({ reports: [] })),
          apiGet('/lab').catch(() => ({ samples: [] }))
        ]);
        
        const cases = casesData.cases || [];
        const samples = labData.samples || [];
        const outbreaks = alertsData.critical?.outbreaks || [];
        const emerging = alertsData.emerging || [];
        const reports = reportsData.reports || [];
        
        let appCount = 0; let voiceCount = 0; let ivrCount = 0;
        reports.forEach(r => {
           if (r.source === 'VOICE') voiceCount++;
           else if (r.source === 'IVR') ivrCount++;
           else appCount++;
        });
        const total = appCount + voiceCount + ivrCount || 1;
        const appPct = Math.round((appCount / total) * 100);
        const voicePct = Math.round((voiceCount / total) * 100);
        const ivrPct = Math.round((ivrCount / total) * 100);

        // Build Attention Required Queue
        let attentionQueue = [];
        
        outbreaks.forEach(o => {
          attentionQueue.push({
            id: o.case_id || o.id, type: 'OUTBREAK',
            title: `${o.syndrome || 'Disease'} — ${o.species || 'Animals'}`,
            location: `${o.cluster_label || o.district || 'Unknown Location'}`,
            stats: `${o.report_count || 5} reports | Cluster Detected`,
            reason: o.sentinel?.reasons?.[0] || 'Critical outbreak threshold met',
            color: 'RED', route: '/vet/alerts'
          });
        });

        cases.forEach(c => {
          if(c.sentinel?.risk_level === 'CRITICAL' || c.sentinel?.risk_level === 'HIGH') {
            attentionQueue.push({
              id: c.id, type: 'EMERGING',
              title: `${c.syndrome} — ${c.species}`,
              location: `${c.village || ''}, ${c.district || ''}`,
              stats: `${c.report_count || 1} reports`,
              reason: c.sentinel?.reasons?.[0] || 'Emerging risk signal detected',
              color: c.sentinel?.risk_level === 'CRITICAL' ? 'RED' : 'AMBER',
              route: '/vet/queue'
            });
          }
        });

        samples.filter(s => s.status === 'PENDING').forEach(s => {
          attentionQueue.push({
             id: s.id, type: 'LAB',
             title: `Lab Follow-up`,
             location: `Sample ${s.id}`,
             stats: `Status: Pending`,
             reason: 'Result expected soon',
             color: 'BLUE', route: '/vet/lab'
          });
        });

        const slaAtRisk = cases.filter(c => c.sentinel?.sla_state === 'AT RISK' || c.sentinel?.sla_state === 'BREACHED').length;

        setSummary({
          totalCases: cases.length,
          critical: outbreaks.length + cases.filter(c => c.sentinel?.risk_level === 'CRITICAL').length,
          highRisk: cases.filter(c => c.sentinel?.risk_level === 'HIGH').length,
          activeCases: cases.filter(c => c.status === 'CASE' || c.status === 'CLUSTER').length,
          pendingLab: samples.filter(s => s.status === 'PENDING').length,
          slaAtRisk,
          attentionQueue: attentionQueue.slice(0, 5), // Top 5 priority items
          appPct, voicePct, ivrPct, fieldWorkerPct: 0, webPct: 0
        });
      } catch (_) {}
      finally { setLoading(false); }
    }
    fetchSummary();
  }, []);

  
  const greeting = getGreeting().toUpperCase();

  return (
    <Layout title="Operations Center">
      <div className="page-content" style={{ paddingBottom: '100px' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "12px", letterSpacing: "1px", color: "#666", margin: "0 0 4px 0" }}>{greeting}, DR. {user?.name?.toUpperCase() || 'VET'}</h2>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1B5E20", margin: 0 }}>Animal Health Surveillance</h1>
        </div>

        {loading || !summary ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading intelligence...</div>
        ) : (
          <>
            {/* COMPACT KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "32px" }}>
              <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#333" }}>{summary.totalCases}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#666", textTransform: "uppercase" }}>Reports</div>
              </div>
              <div style={{ background: "#FFEBEE", padding: "16px", borderRadius: "12px", border: "1px solid #FFCDD2", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#C62828" }}>{summary.critical}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#C62828", textTransform: "uppercase" }}>Critical</div>
              </div>
              <div style={{ background: "#FFF8E1", padding: "16px", borderRadius: "12px", border: "1px solid #FFECB3", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#F57F17" }}>{summary.highRisk}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#F57F17", textTransform: "uppercase" }}>High Risk</div>
              </div>
              <div style={{ background: "#E8F5E9", padding: "16px", borderRadius: "12px", border: "1px solid #C8E6C9", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#2E7D32" }}>{summary.activeCases}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#2E7D32", textTransform: "uppercase" }}>Active</div>
              </div>
              <div style={{ background: "#E3F2FD", padding: "16px", borderRadius: "12px", border: "1px solid #BBDEFB", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#1565C0" }}>{summary.pendingLab}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#1565C0", textTransform: "uppercase" }}>Labs</div>
              </div>
              <div style={{ background: summary.slaAtRisk > 0 ? "#FFEBEE" : "white", padding: "16px", borderRadius: "12px", border: summary.slaAtRisk > 0 ? "1px solid #FFCDD2" : "1px solid #eee", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: summary.slaAtRisk > 0 ? "#B71C1C" : "#333" }}>{summary.slaAtRisk}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: summary.slaAtRisk > 0 ? "#B71C1C" : "#666", textTransform: "uppercase" }}>SLA Risk</div>
              </div>
            </div>

            
              {/* REPORT CHANNELS (ANALYTICS) */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#333", margin: "0 0 16px 0", textTransform: "uppercase" }}>Report Sources</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#1565C0" }}>{summary.appPct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>APP / WEB</div>
                   </div>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#7B1FA2" }}>{summary.voicePct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>VOICE</div>
                   </div>
                   <div style={{ flex: "1 1 100px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                     <div style={{ fontSize: "28px", fontWeight: "800", color: "#E65100" }}>{summary.ivrPct}%</div>
                     <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginTop: "4px" }}>IVR</div>
                   </div>
                </div>
              </div>

              {/* ATTENTION REQUIRED ZONE */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#333", margin: 0, textTransform: "uppercase" }}>Attention Required</h3>
                <span style={{ fontSize: "12px", color: "#666", fontWeight: "600", cursor: "pointer" }} onClick={() => navigate('/vet/queue')}>View Queue &rarr;</span>
              </div>
              
              {summary.attentionQueue.length === 0 ? (
                <div style={{ background: "white", padding: "32px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                   <CheckCircle size={32} color="#4CAF50" style={{ marginBottom: "12px" }}/>
                   <div style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>All Clear</div>
                   <div style={{ fontSize: "13px", color: "#666" }}>No items require immediate attention.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {summary.attentionQueue.map((item, idx) => (
                    <div key={idx} style={{ 
                      background: "white", borderRadius: "12px", padding: "20px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #eee",
                      borderLeft: `6px solid ${item.color === 'RED' ? '#C62828' : item.color === 'AMBER' ? '#F57C00' : '#1565C0'}`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "800", color: item.color === 'RED' ? '#C62828' : item.color === 'AMBER' ? '#F57C00' : '#1565C0', letterSpacing: "1px", marginBottom: "4px" }}>
                            {item.color === 'RED' ? 'CRITICAL CASE' : item.color === 'AMBER' ? 'EMERGING SIGNAL' : 'LAB FOLLOW-UP'}
                          </div>
                          <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#333" }}>{item.title}</h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#666", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                            {item.type === 'LAB' ? <FlaskConical size={14}/> : <MapPin size={14}/>} {item.location}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                           <span style={{ fontSize: "12px", fontWeight: "700", background: "#f5f5f5", padding: "4px 8px", borderRadius: "6px", color: "#444" }}>{item.stats}</span>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: "14px", color: "#444", marginBottom: "16px", background: "#fafafa", padding: "10px 12px", borderRadius: "6px", border: "1px solid #f0f0f0" }}>
                        <strong>Reason:</strong> {item.reason}
                      </div>
                      
                      <button onClick={() => navigate(item.route)} className="btn btn-secondary btn-block">
                        {item.type === 'LAB' ? 'VIEW LAB' : item.type === 'EMERGING' ? 'OPEN SENTINEL' : 'OPEN CASE'}
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#666", margin: "0 0 12px 0", textTransform: "uppercase" }}>Tools</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div onClick={() => navigate('/vet/map')} style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                   <MapIcon size={24} color="#2E7D32"/>
                   <span style={{ fontWeight: "700", color: "#333" }}>District Map</span>
                </div>
                <div onClick={() => navigate('/vet/district')} style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                   <BarChart2 size={24} color="#1565C0"/>
                   <span style={{ fontWeight: "700", color: "#333" }}>Analytics</span>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </Layout>
  );
}
