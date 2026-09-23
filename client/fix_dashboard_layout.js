const fs = require('fs');
const file = 'src/pages/farmer/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 =         </div>
          <div className="side-col">
          {/* Quick Tips */}
        <section style={{ marginBottom:"20px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"700", marginBottom:"12px", color:"#1B5E20" }}>{t.tipTitle}</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {t.tips.map((tip, i) => (
                <div key={i} style={{
                  background:"#F1F8E9", borderRadius:"8px", padding:"12px 14px",
                  display:"flex", alignItems:"flex-start", gap:"12px",
                  borderLeft:"4px solid #8BC34A"
                }}>
                  <div style={{ marginTop:"2px", opacity: 0.8 }}>{TIP_ICONS[tip.icon]}</div>
                  <p style={{ margin:0, fontSize:"13.5px", color:"#333", lineHeight:"1.4", fontWeight:"500" }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </section>;

const replacement1 =         {/* ── Quick Tips ── */}
        <section style={{ marginBottom:"20px", marginTop:"8px" }}>
          <h3 style={{ fontSize:"15px", fontWeight:"700", marginBottom:"12px", color:"#1B5E20", display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ background:"#E8F5E9", borderRadius:"8px", padding:"4px 6px", display:"inline-flex" }}>
              <ShieldAlert size={16} color="#2E7D32" />
            </span>
            {t.tipTitle}
          </h3>
          <div style={{
            background:"white", borderRadius:"14px", padding:"14px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0f0f0"
          }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {t.tips.map((tip, i) => (
                <div key={i} style={{
                  background:"#F9FBE7", borderRadius:"10px", padding:"12px 14px",
                  display:"flex", alignItems:"center", gap:"14px",
                  borderLeft:"4px solid #8BC34A"
                }}>
                  <div style={{ background:"#E8F5E9", borderRadius:"8px", padding:"6px", flexShrink:0 }}>
                    {TIP_ICONS[tip.icon]}
                  </div>
                  <p style={{ margin:0, fontSize:"13px", color:"#333", lineHeight:"1.5", fontWeight:"500" }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>;

const target2 =         {/* Recent Reports */}
        <section style={{ marginBottom:"20px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#1B5E20", marginBottom:"12px" }}>{t.recent}</h3>
          {loading ? (
            <div className="loading-state">{t.loading}</div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", background:"white", borderRadius:"12px", color:"#888" }}>
              <ClipboardList size={40} color="#ccc" style={{ marginBottom:"10px" }} />
              <p style={{ margin:0 }}>{t.noReports}</p>
            </div>
          ) : (
            <div>
              {reports.slice(0, 5).map((report, idx) => (
                <div key={report.id || report.local_id || idx}
                  onClick={() => navigate("/farmer/report/" + (report.id || report.local_id))}
                  style={{ background:"white", borderRadius:"12px", marginBottom:"10px", padding:"14px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
                  <div className="report-header">
                    <strong className="report-syndrome">{report.syndrome || report.disease || "Unknown"}</strong>
                    <PipelineTag status={report.status || "REPORT"} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"6px" }}>
                    <MapPin size={14} color="#888" />
                    <span style={{ fontSize:"13px", color:"#666" }}>{report.village || "Unknown location"}</span>
                    <span style={{ fontSize:"13px", color:"#aaa", marginLeft:"8px" }}>— {report.species || "Animal"}</span>
                  </div>
                  <div style={{ marginTop:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #f0f0f0", paddingTop:"10px" }}>
                      <span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime(report.capturedAt || report.captured_at)}</span>
                      <span style={{ fontSize:"12px", color:"#1B5E20", fontWeight:"700", display:"flex", alignItems:"center" }}>{t.viewReport}</span>
                    </div>
                </div>
              ))}
            </div>
          )}
        </section>;

const replacement2 =         {/* ── Recent Reports ── */}
        <section style={{ marginBottom:"20px" }}>
          <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#1B5E20", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ background:"#E3F2FD", borderRadius:"8px", padding:"4px 6px", display:"inline-flex" }}>
              <ClipboardList size={16} color="#1565C0" />
            </span>
            {t.recent}
          </h3>
          {loading ? (
            <div className="loading-state">{t.loading}</div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", background:"white", borderRadius:"14px", color:"#888", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0f0f0" }}>
              <ClipboardList size={44} color="#ddd" style={{ marginBottom:"12px" }} />
              <p style={{ margin:0, fontSize:"14px" }}>{t.noReports}</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {reports.slice(0, 5).map((report, idx) => (
                <div key={report.id || report.local_id || idx}
                  onClick={() => navigate("/farmer/report/" + (report.id || report.local_id))}
                  style={{
                    background:"white", borderRadius:"14px", padding:"16px",
                    cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                    border:"1px solid #f0f0f0", transition:"box-shadow 0.2s"
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <strong style={{ fontSize:"15px", color:"#222" }}>{report.syndrome || report.disease || "Unknown"}</strong>
                    <PipelineTag status={report.status || "REPORT"} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"8px" }}>
                    <MapPin size={14} color="#888" />
                    <span style={{ fontSize:"13px", color:"#666" }}>{report.village || "Unknown location"}</span>
                    <span style={{ fontSize:"13px", color:"#aaa", marginLeft:"6px" }}>— {report.species || "Animal"}</span>
                  </div>
                  <div style={{ marginTop:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #f0f0f0", paddingTop:"10px" }}>
                    <span style={{ fontSize:"12px", color:"#aaa" }}>{formatKolkataTime(report.capturedAt || report.captured_at)}</span>
                    <span style={{ fontSize:"12px", color:"#1B5E20", fontWeight:"700" }}>{t.viewReport}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>;

// Use Regex to handle CRLF issues
content = content.replace(new RegExp(target1.replace(/\\r\\n|\\n/g, '\\r?\\n')), replacement1);
content = content.replace(new RegExp(target2.replace(/\\r\\n|\\n/g, '\\r?\\n')), replacement2);

fs.writeFileSync(file, content, 'utf8');
console.log('Dashboard layout fixed successfully!');
