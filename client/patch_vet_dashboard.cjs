const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "src/pages/vet/Dashboard.jsx");
let code = fs.readFileSync(file, "utf8");

// 1. Add Timer icon for SLA
code = code.replace(
  "AlertTriangle, BarChart2, Bell, Activity, ClipboardList, Map as MapIcon, Syringe, Dna, Microscope",
  "AlertTriangle, BarChart2, Bell, Activity, ClipboardList, Map as MapIcon, Syringe, Dna, Microscope, Timer, ShieldAlert"
);

// 2. Add extra state and fetch logic
const newFetch = `
        const [alertsData, casesData, labData, reportsData] = await Promise.all([
          apiGet('/alerts').catch(() => ({ critical: { cases: [], outbreaks: [] } })),
          apiGet('/cases').catch(() => ({ cases: [] })),
          apiGet('/lab').catch(() => ({ samples: [] })),
          apiGet('/reports').catch(() => ({ reports: [] }))
        ]);
        const cases = casesData.cases || casesData || [];
        const samples = labData.samples || labData || [];
        const reports = reportsData.reports || reportsData || [];
        const criticalCount = (alertsData.critical?.cases?.length || 0) + (alertsData.critical?.outbreaks?.length || 0);
        
        // SLA breach = Reports un-actioned for > 24hrs
        const now = new Date();
        let slaBreaches = 0;
        reports.forEach(r => {
           if(r.status === 'REPORT' || r.status === 'SUSPECTED_OUTBREAK') {
              const diffHours = (now - new Date(r.captured_at)) / (1000 * 60 * 60);
              if (diffHours > 24) slaBreaches++;
           }
        });

        setSummary({
          totalReports: reports.length,
          activeCases: cases.filter((c) => c.status === 'ACTIVE' || c.status === 'CASE').length,
          suspectedOutbreaks: (alertsData.critical?.outbreaks?.length || 0) + reports.filter(r => r.status === 'SUSPECTED_OUTBREAK').length,
          pendingLab: samples.filter((s) => s.status === 'PENDING').length,
          criticalAlerts: criticalCount,
          slaBreaches,
          recentReports: reports.slice(0, 3)
        });
`;

code = code.replace(/const \[alertsData, casesData\] = await Promise\.all\(\[\s+apiGet\('\/alerts'\)[\s\S]*?criticalAlerts: criticalCount,\s+\}\);/m, newFetch);

// 3. Update summary-grid to include SLA
const newGrid = `
          <div className="summary-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "24px" }}>
            <div className="summary-card" style={{ background:"#F5F5F5" }}>
              <div className="summary-num" style={{ color:"#333" }}>{summary.totalReports}</div>
              <div className="summary-label">Total Reports</div>
            </div>
            <div className="summary-card" style={{ background:"#FFF8E1" }}>
              <div className="summary-num" style={{ color:"#F57F17" }}>{summary.activeCases}</div>
              <div className="summary-label">Active Cases</div>
            </div>
            <div className="summary-card" style={{ background:"#FFEBEE" }}>
              <div className="summary-num" style={{ color:"#C62828" }}>{summary.suspectedOutbreaks}</div>
              <div className="summary-label">Suspected Outbreaks</div>
            </div>
            <div className="summary-card" style={{ background:"#E3F2FD" }}>
              <div className="summary-num" style={{ color:"#1565C0" }}>{summary.pendingLab}</div>
              <div className="summary-label">Pending Lab</div>
            </div>
            <div className="summary-card" style={{ background:"#FFEBEE", border:"1px solid #FFCDD2" }}>
              <div className="summary-num" style={{ color:"#B71C1C", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                {summary.slaBreaches > 0 && <Timer size={20} />} {summary.slaBreaches}
              </div>
              <div className="summary-label" style={{ color:"#B71C1C", fontWeight:"700" }}>SLA Breaches (&gt;24h)</div>
            </div>
          </div>
`;
code = code.replace(/<div className="summary-grid">[\s\S]*?<\/div>\s*<\/div>/m, newGrid);

// 4. Insert Recent Reports section before nav-cards-grid
const recentReportsSection = `
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1B5E20", marginBottom: "12px" }}>Recent Field Reports</h3>
          {summary.recentReports && summary.recentReports.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {summary.recentReports.map(r => (
                <div key={r.id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#333" }}>{r.syndrome} in {r.species}</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#666", marginTop: "2px" }}><MapIcon size={12} style={{ display: "inline", marginBottom: "-2px" }}/> {r.village}, {r.district}</p>
                    </div>
                    {r.status === 'SUSPECTED_OUTBREAK' ? (
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#FFEBEE", color: "#C62828", padding: "4px 8px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldAlert size={12} /> CRITICAL
                      </span>
                    ) : r.mortality_count > 0 ? (
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#FFF8E1", color: "#F57F17", padding: "4px 8px", borderRadius: "12px" }}>HIGH RISK</span>
                    ) : (
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#F5F5F5", color: "#666", padding: "4px 8px", borderRadius: "12px" }}>ROUTINE</span>
                    )}
                  </div>
                  <div style={{ fontSize: "13px", color: "#444", marginBottom: "12px" }}>
                    <strong>Symptoms:</strong> {r.symptoms}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "12px" }}>
                    <span style={{ fontSize: "11px", color: "#888" }}>{new Date(r.captured_at).toLocaleString()}</span>
                    <button style={{ background: "none", border: "none", color: "#1565C0", fontSize: "13px", fontWeight: "600", cursor: "pointer" }} onClick={() => navigate("/vet/alerts")}>Review Case</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", background: "white", borderRadius: "12px", color: "#888", fontSize: "14px" }}>No recent reports found.</div>
          )}
        </div>
`;

code = code.replace('<div className="nav-cards-grid">', recentReportsSection + '\n        <div className="nav-cards-grid">');

fs.writeFileSync(file, code, "utf8");
console.log("VetDashboard.jsx patched successfully!");
