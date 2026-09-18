import { useState } from "react";
import { Search, Plus, ChevronRight, Syringe, Heart, AlertCircle, Calendar, ArrowLeft, Activity } from "lucide-react";
import Layout from "../../components/Layout.jsx";

const SPECIES_COLORS = {
  Cattle:  { bg: "#FFF8E1", color: "#F57F17" },
  Buffalo: { bg: "#ECEFF1", color: "#546E7A" },
  Goat:    { bg: "#E8F5E9", color: "#2E7D32" },
  Sheep:   { bg: "#E3F2FD", color: "#1565C0" },
};

const ANIMALS = [
  { id:"C-001", tagId:"GJ-RJ-4821", species:"Cattle", breed:"Gir", sex:"Female", age:"4 yrs", village:"Gondal", status:"healthy", vaccinated:true, lastVaccine:"FMD — Apr 2026", vaccines:[{name:"FMD",date:"08 Apr 2026",batch:"VB-FMD-2026-441",vet:"Dr. Priya Sharma",status:"Valid"},{name:"HS",date:"10 Jan 2026",batch:"VB-HS-2026-112",vet:"Dr. R. Patil",status:"Valid"}], treatments:[], events:[{date:"08 Apr 2026",text:"FMD Vaccination administered"},{date:"10 Jan 2026",text:"HS Vaccination administered"}] },
  { id:"C-002", tagId:"GJ-RJ-4822", species:"Cattle", breed:"Sahiwal", sex:"Female", age:"3 yrs", village:"Gondal", status:"healthy", vaccinated:true, lastVaccine:"FMD — Apr 2026", vaccines:[{name:"FMD",date:"08 Apr 2026",batch:"VB-FMD-2026-442",vet:"Dr. Priya Sharma",status:"Valid"}], treatments:[], events:[{date:"08 Apr 2026",text:"FMD Vaccination administered"}] },
  { id:"B-001", tagId:"GJ-RJ-4830", species:"Buffalo", breed:"Murrah", sex:"Female", age:"6 yrs", village:"Gondal", status:"healthy", vaccinated:true, lastVaccine:"HS — Jan 2026", vaccines:[{name:"HS",date:"10 Jan 2026",batch:"VB-HS-2026-112",vet:"Dr. R. Patil",status:"Valid"}], treatments:[], events:[{date:"10 Jan 2026",text:"HS Vaccination administered"}] },
  { id:"B-002", tagId:"GJ-RJ-4831", species:"Buffalo", breed:"Jafarabadi", sex:"Female", age:"5 yrs", village:"Dhoraji", status:"under_observation", vaccinated:true, lastVaccine:"HS — Jan 2026", vaccines:[{name:"HS",date:"10 Jan 2026",batch:"VB-HS-2026-113",vet:"Dr. R. Patil",status:"Valid"}], treatments:[{drug:"Oxytetracycline 10mg/kg IM",date:"12 Sep 2026",withdrawal:"26 Sep 2026"}], events:[{date:"18 Sep 2026",text:"Fever reported — under observation"},{date:"12 Sep 2026",text:"Oxytetracycline administered"},{date:"10 Jan 2026",text:"HS Vaccination administered"}] },
  { id:"G-001", tagId:"GJ-RJ-4840", species:"Goat", breed:"Osmanabadi", sex:"Male", age:"2 yrs", village:"Gondal", status:"healthy", vaccinated:false, lastVaccine:"None", vaccines:[], treatments:[], events:[] },
  { id:"G-002", tagId:"GJ-RJ-4841", species:"Goat", breed:"Sirohi", sex:"Female", age:"1.5 yrs", village:"Upleta", status:"healthy", vaccinated:true, lastVaccine:"PPR — Nov 2025", vaccines:[{name:"PPR",date:"20 Nov 2025",batch:"VB-PPR-2025-204",vet:"Dr. R. Patil",status:"Valid"}], treatments:[], events:[{date:"20 Nov 2025",text:"PPR Vaccination administered"}] },
  { id:"C-003", tagId:"GJ-RJ-4850", species:"Cattle", breed:"HF Cross", sex:"Female", age:"3 yrs", village:"Gondal", status:"healthy", vaccinated:true, lastVaccine:"BQ — Mar 2026", vaccines:[{name:"BQ",date:"05 Mar 2026",batch:"VB-BQ-2026-889",vet:"Dr. Priya Sharma",status:"Valid"}], treatments:[], events:[{date:"05 Mar 2026",text:"BQ Vaccination administered"}] },
  { id:"S-001", tagId:"GJ-RJ-4860", species:"Sheep", breed:"Marwari", sex:"Male", age:"2 yrs", village:"Dhoraji", status:"healthy", vaccinated:true, lastVaccine:"PPR — Nov 2025", vaccines:[{name:"PPR",date:"20 Nov 2025",batch:"VB-PPR-2025-205",vet:"Dr. R. Patil",status:"Valid"}], treatments:[], events:[{date:"20 Nov 2025",text:"PPR Vaccination administered"}] },
  { id:"C-004", tagId:"GJ-RJ-4870", species:"Cattle", breed:"Gir", sex:"Male", age:"5 yrs", village:"Upleta", status:"under_observation", vaccinated:true, lastVaccine:"FMD — Apr 2026", vaccines:[{name:"FMD",date:"08 Apr 2026",batch:"VB-FMD-2026-443",vet:"Dr. Priya Sharma",status:"Valid"}], treatments:[{drug:"Meloxicam 0.5mg/kg",date:"17 Sep 2026",withdrawal:"01 Oct 2026"}], events:[{date:"18 Sep 2026",text:"Lameness reported"},{date:"17 Sep 2026",text:"Meloxicam administered"},{date:"08 Apr 2026",text:"FMD Vaccination administered"}] },
  { id:"G-003", tagId:"GJ-RJ-4880", species:"Goat", breed:"Surti", sex:"Female", age:"3 yrs", village:"Gondal", status:"healthy", vaccinated:false, lastVaccine:"None", vaccines:[], treatments:[], events:[] },
];

const SUMMARY = { total: 27, healthy: 24, observation: 2, vacDue: 4 };
const FILTERS = ["All", "Cattle", "Buffalo", "Goat", "Sheep"];

const cardStyle = { background:"white", borderRadius:"14px", padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", marginBottom:"12px" };
const badgeStyle = (bg, color) => ({ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", background:bg, color });

export default function HerdLedger() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = ANIMALS.filter(a => {
    const matchSearch = !search || a.tagId.toLowerCase().includes(search.toLowerCase()) || a.species.toLowerCase().includes(search.toLowerCase()) || a.breed.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.species === filter;
    return matchSearch && matchFilter;
  });

  if (selected) {
    const a = selected;
    const sc = SPECIES_COLORS[a.species] || { bg:"#F5F5F5", color:"#666" };
    return (
      <Layout title={a.tagId} showBack>
        <div className="page-content" style={{ paddingBottom:"120px" }}>
          {/* Profile Card */}
          <div style={cardStyle}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:sc.bg, color:sc.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"800", fontSize:"18px" }}>{a.species[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"18px", fontWeight:"700", color:"#333" }}>{a.tagId}</div>
                <div style={{ fontSize:"13px", color:"#888" }}>{a.species} &bull; {a.breed} &bull; {a.sex}</div>
              </div>
              {a.status === "healthy"
                ? <span style={badgeStyle("#E8F5E9","#2E7D32")}><Heart size={12}/> Healthy</span>
                : <span style={badgeStyle("#FFF8E1","#F57F17")}><AlertCircle size={12}/> Under Observation</span>
              }
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              <div style={{ background:"#F5F5F5", borderRadius:"10px", padding:"10px" }}><div style={{ fontSize:"11px", color:"#999" }}>Age</div><div style={{ fontSize:"14px", fontWeight:"600" }}>{a.age}</div></div>
              <div style={{ background:"#F5F5F5", borderRadius:"10px", padding:"10px" }}><div style={{ fontSize:"11px", color:"#999" }}>Village</div><div style={{ fontSize:"14px", fontWeight:"600" }}>{a.village}</div></div>
            </div>
          </div>

          {/* Vaccination History */}
          <div style={cardStyle}>
            <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#1B5E20", margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:"8px" }}><Syringe size={16} color="#1565C0"/> Vaccination History</h3>
            {a.vaccines.length === 0 ? (
              <div style={{ padding:"16px", background:"#FFEBEE", borderRadius:"10px", fontSize:"13px", color:"#C62828" }}>No vaccinations recorded. Contact your nearest vet.</div>
            ) : a.vaccines.map((v,i) => (
              <div key={i} style={{ padding:"12px", background: i===0 ? "#E3F2FD" : "#F5F5F5", borderRadius:"10px", marginBottom:"8px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:"14px", fontWeight:"600" }}>{v.name} — {v.date}</div>
                  <span style={{ fontSize:"11px", fontWeight:"700", color:"#1565C0" }}>{v.status}</span>
                </div>
                <div style={{ fontSize:"12px", color:"#888", marginTop:"4px" }}>Batch: {v.batch} | {v.vet}</div>
              </div>
            ))}
          </div>

          {/* Treatment History */}
          <div style={cardStyle}>
            <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#1B5E20", margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:"8px" }}><Activity size={16} color="#7B1FA2"/> Treatment History</h3>
            {a.treatments.length === 0 ? (
              <div style={{ fontSize:"13px", color:"#999", padding:"12px 0" }}>No drug administration recorded.</div>
            ) : a.treatments.map((tr,i) => (
              <div key={i} style={{ padding:"12px", background:"#F3E5F5", borderRadius:"10px", marginBottom:"8px" }}>
                <div style={{ fontSize:"14px", fontWeight:"600" }}>{tr.drug}</div>
                <div style={{ fontSize:"12px", color:"#888", marginTop:"4px" }}>Administered: {tr.date} | Withdrawal ends: {tr.withdrawal}</div>
              </div>
            ))}
          </div>

          {/* Health Timeline */}
          <div style={cardStyle}>
            <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#1B5E20", margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:"8px" }}><Calendar size={16} color="#E65100"/> Health Timeline</h3>
            {a.events.length === 0 ? (
              <div style={{ fontSize:"13px", color:"#999", padding:"12px 0" }}>No health events recorded.</div>
            ) : a.events.map((ev,i) => (
              <div key={i} style={{ display:"flex", gap:"12px", marginBottom:"12px" }}>
                <div style={{ width:"8px", minHeight:"100%", borderRadius:"4px", background: i===0 ? "#2E7D32" : "#E0E0E0" }}/>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:"700", color:"#555" }}>{ev.date}</div>
                  <div style={{ fontSize:"13px", color:"#666", marginTop:"2px" }}>{ev.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Herd Ledger" showBack>
      <div className="page-content" style={{ paddingBottom:"120px" }}>
        {/* Summary Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"8px", marginBottom:"16px" }}>
          {[
            { label:"Total", val:SUMMARY.total, bg:"#F5F5F5", color:"#333" },
            { label:"Healthy", val:SUMMARY.healthy, bg:"#E8F5E9", color:"#2E7D32" },
            { label:"Observing", val:SUMMARY.observation, bg:"#FFF8E1", color:"#F57F17" },
            { label:"Vac. Due", val:SUMMARY.vacDue, bg:"#FFEBEE", color:"#C62828" },
          ].map(c => (
            <div key={c.label} style={{ textAlign:"center", padding:"12px 4px", background:c.bg, borderRadius:"12px" }}>
              <div style={{ fontSize:"22px", fontWeight:"800", color:c.color }}>{c.val}</div>
              <div style={{ fontSize:"10px", fontWeight:"600", color:c.color, opacity:0.8 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:"12px" }}>
          <Search size={16} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#aaa" }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tag, species or breed..."
            style={{ width:"100%", padding:"10px 12px 10px 36px", border:"1px solid #E0E0E0", borderRadius:"12px", fontSize:"14px", outline:"none", background:"white", boxSizing:"border-box" }}/>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:"flex", gap:"6px", overflowX:"auto", marginBottom:"16px", paddingBottom:"4px" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"6px 14px", borderRadius:"20px", border:"none", fontSize:"12px", fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap",
              background: filter === f ? "#2E7D32" : "#F0F0F0", color: filter === f ? "white" : "#666"
            }}>{f}</button>
          ))}
        </div>

        {/* Count + Add */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
          <span style={{ fontSize:"13px", color:"#888" }}>{filtered.length} animals</span>
          <button style={{ display:"flex", alignItems:"center", gap:"6px", background:"#2E7D32", color:"white", border:"none", padding:"8px 14px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
            <Plus size={16}/> Add Animal
          </button>
        </div>

        {/* Animal Cards */}
        {filtered.map(a => {
          const sc = SPECIES_COLORS[a.species] || { bg:"#F5F5F5", color:"#666" };
          return (
            <div key={a.id} onClick={() => setSelected(a)} style={{
              ...cardStyle, display:"flex", alignItems:"center", cursor:"pointer", gap:"12px",
              transition:"box-shadow 0.2s", border:"1px solid #f0f0f0"
            }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:sc.bg, color:sc.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"800", fontSize:"15px", flexShrink:0 }}>{a.species[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
                  <span style={{ fontSize:"14px", fontWeight:"700", color:"#333" }}>{a.tagId}</span>
                  {a.status !== "healthy" && <span style={{ fontSize:"10px", fontWeight:"700", background:"#FFF8E1", color:"#F57F17", padding:"2px 8px", borderRadius:"10px" }}>Under Obs.</span>}
                </div>
                <div style={{ fontSize:"12px", color:"#999" }}>{a.species} &bull; {a.breed} &bull; {a.age}</div>
                <div style={{ fontSize:"11px", color:"#bbb", marginTop:"3px", display:"flex", alignItems:"center", gap:"4px" }}><Syringe size={11}/> {a.vaccinated ? a.lastVaccine : "Not vaccinated"}</div>
              </div>
              <ChevronRight size={18} color="#ccc"/>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#999" }}>
            <Search size={40} color="#ddd" style={{ marginBottom:"12px" }}/>
            <p style={{ margin:0, fontSize:"14px" }}>No animals match your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
