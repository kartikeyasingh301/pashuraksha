const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "src/pages/farmer/ReportForm.jsx");
let code = fs.readFileSync(file, "utf8");

// 1. Add lucide icons
code = code.replace(
  'import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send, Languages } from "lucide-react";',
  'import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send, Languages, ShieldAlert, Activity, Info } from "lucide-react";'
);

// 2. Add to SYMPTOM_LIST
code = code.replace(
  'const SYMPTOM_LIST = ["Fever", "Lameness", "Blisters/Ulcers", "Respiratory distress", "Neurological signs", "Diarrhea", "Sudden death", "Abortion", "Swelling", "Loss of appetite"];',
  'const SYMPTOM_LIST = ["Fever", "Lameness", "Blisters/Ulcers", "Respiratory distress", "Neurological signs", "Diarrhea", "Sudden death", "Abortion", "Swelling", "Loss of appetite", "Excessive Salivation", "Nasal Discharge", "Skin Lesions", "Coughing"];'
);

// 3. Add to translations EN (only adding en fields for the new ones so we don\'t mess up hindi/marathi arrays)
code = code.replace(
  'vaccine: { "Vaccinated":"Vaccinated", "Unvaccinated":"Unvaccinated", "Unknown":"Unknown" }',
  `vaccine: { "Vaccinated":"Vaccinated", "Unvaccinated":"Unvaccinated", "Unknown":"Unknown" },
    lblHerdSize: "Herd Size",
    lblOnsetDate: "Onset Date",
    lblRecentMovement: "Recent animal movement?",
    lblNewAnimals: "New animals added recently?",
    lblContactHerds: "Contact with other herds?"`
);

// 4. Update initialForm
code = code.replace(
  'const initialForm = { species: "", syndrome: "", symptoms: [], mortalityCount: 0, animalId: "", village: "", vaccinationStatus: "Unknown", notes: "" };',
  'const initialForm = { species: "", syndrome: "", symptoms: [], mortalityCount: 0, animalId: "", village: "", vaccinationStatus: "Unknown", notes: "", herdSize: "", onsetDate: "", recentMovement: false, newAnimals: false, contactHerds: false };'
);

// 5. Update buildReport
code = code.replace(
  'herd_id: form.animalId.trim() || null,',
  `herd_id: form.animalId.trim() || null,
      herd_size: parseInt(form.herdSize) || 0,
      onset_date: form.onsetDate || null,
      recent_movement: form.recentMovement,
      new_animals: form.newAnimals,
      contact_herds: form.contactHerds,`
);

// 6. Add Triage Engine
const triageEngine = `
  function runTriage(f) {
    const s = f.symptoms || [];
    let risk = "LOW"; let condition = "Under Review"; let actions = ["Isolate animal", "Observe for 24h"];
    if (s.includes("Sudden death")) { risk = "CRITICAL"; condition = "Suspected Anthrax"; actions = ["Do not open carcass", "Contact vet immediately", "Evacuate area"]; }
    else if ((f.species === "Cattle" || f.species === "Buffalo") && s.includes("Fever") && (s.includes("Lameness") || s.includes("Blisters/Ulcers") || s.includes("Excessive Salivation"))) { risk = "HIGH"; condition = "Suspected FMD"; actions = ["Isolate sick animals", "Stop animal movement", "Disinfect premises"]; }
    else if ((f.species === "Goat" || f.species === "Sheep") && s.includes("Fever") && s.includes("Diarrhea") && (s.includes("Respiratory distress") || s.includes("Nasal Discharge"))) { risk = "HIGH"; condition = "Suspected PPR"; actions = ["Isolate sick animals", "Provide hydration", "Stop grazing in common areas"]; }
    else if (f.species === "Cattle" && s.includes("Fever") && s.includes("Skin Lesions")) { risk = "HIGH"; condition = "Suspected Lumpy Skin Disease"; actions = ["Isolate sick animal", "Control flies/mosquitoes"]; }
    return { risk, condition, actions };
  }
`;

code = code.replace(
  'function validate() {',
  triageEngine + '\n  function validate() {'
);

// 7. Update handleSubmit to include triageResult in success state
code = code.replace(
  'setSuccess({ type: "online", id: result.id || result.reportId || result.report?.id || "submitted" });',
  'setSuccess({ type: "online", id: result.id || result.reportId || result.report?.id || "submitted", triage: runTriage(form) });'
);
code = code.replace(
  'setSuccess({ type: "offline" });',
  'setSuccess({ type: "offline", triage: runTriage(form) });'
);

// 8. Add Triage UI (replaces the existing success block)
const oldSuccessBlock = `
        {success && (
          <div className="alert-success" style={{ marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
            <CheckCircle size={20} />
            <div>
              <p style={{ margin:0, fontWeight:"600" }}>{success.type === "online" ? t.successOnline : (success.type === "offline_fallback" || success.type === "offlineError" ? t.successError + success.message + ")" : t.successOffline)} {success.id && <strong>{success.id}</strong>}</p>
              <button className="btn-outline btn-sm" style={{ marginTop:"10px", padding:"4px 12px" }} onClick={() => setSuccess(null)}>Submit Another</button>
            </div>
          </div>
        )}
`;

const newSuccessBlock = `
        {success && (
          <div style={{ marginBottom:"24px", background:"white", borderRadius:"12px", border:"1px solid #E0E0E0", overflow:"hidden", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ background: success.triage?.risk === "CRITICAL" ? "#D32F2F" : success.triage?.risk === "HIGH" ? "#F57C00" : "#388E3C", color:"white", padding:"16px", display:"flex", alignItems:"center", gap:"12px" }}>
              {success.triage?.risk === "CRITICAL" ? <ShieldAlert size={28}/> : success.triage?.risk === "HIGH" ? <AlertTriangle size={28}/> : <CheckCircle size={28}/>}
              <div>
                <h3 style={{ margin:0, fontSize:"18px", fontWeight:"700" }}>Triage Result: {success.triage?.condition}</h3>
                <p style={{ margin:0, fontSize:"13px", opacity:0.9, marginTop:"4px" }}>Risk Level: {success.triage?.risk} | Report ID: {success.id || "Saved Offline"}</p>
              </div>
            </div>
            <div style={{ padding:"16px" }}>
              <p style={{ fontSize:"14px", color:"#444", marginBottom:"12px", fontWeight:"600" }}>Recommended Actions:</p>
              <ul style={{ margin:"0 0 16px 0", paddingLeft:"20px", color:"#333", fontSize:"14px", display:"flex", flexDirection:"column", gap:"8px" }}>
                {success.triage?.actions.map((act, idx) => <li key={idx}>{act}</li>)}
              </ul>
              <div style={{ background:"#FFF8E1", padding:"12px", borderRadius:"8px", fontSize:"12px", color:"#F57F17", display:"flex", gap:"8px", alignItems:"flex-start" }}>
                <Info size={16} style={{ flexShrink:0, marginTop:"2px" }}/>
                <span>This is an automated preliminary assessment. A field veterinarian will review your report shortly.</span>
              </div>
              <button className="btn-outline btn-sm" style={{ marginTop:"16px", width:"100%" }} onClick={() => setSuccess(null)}>Submit Another Report</button>
            </div>
          </div>
        )}
`;
code = code.replace(oldSuccessBlock, newSuccessBlock);

// 9. Add Epidemiology Fields (below symptoms)
const epiFields = `
              {/* Epidemiology Fields */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginTop:"16px" }}>
                <div className="form-group">
                  <label className="form-label">{t.lblOnsetDate || "Onset Date"}</label>
                  <input type="date" name="onsetDate" value={form.onsetDate} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.lblHerdSize || "Total Herd Size"}</label>
                  <input type="number" name="herdSize" min="0" value={form.herdSize} onChange={handleChange} className="form-control" />
                </div>
              </div>
              
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"8px", marginBottom:"16px", background:"#FAFAFA", padding:"12px", borderRadius:"8px", border:"1px solid #E0E0E0" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#444", cursor:"pointer" }}>
                  <input type="checkbox" name="recentMovement" checked={form.recentMovement} onChange={e => setForm(p => ({...p, recentMovement: e.target.checked}))} />
                  {t.lblRecentMovement || "Recent animal movement or travel?"}
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#444", cursor:"pointer" }}>
                  <input type="checkbox" name="newAnimals" checked={form.newAnimals} onChange={e => setForm(p => ({...p, newAnimals: e.target.checked}))} />
                  {t.lblNewAnimals || "New animals added to herd recently?"}
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#444", cursor:"pointer" }}>
                  <input type="checkbox" name="contactHerds" checked={form.contactHerds} onChange={e => setForm(p => ({...p, contactHerds: e.target.checked}))} />
                  {t.lblContactHerds || "Contact with other herds/wildlife?"}
                </label>
              </div>
`;

code = code.replace(
  '<label className="form-label">{t.lblMortality}</label>',
  epiFields + '\n              <label className="form-label">{t.lblMortality}</label>'
);


fs.writeFileSync(file, code, "utf8");
console.log("ReportForm.jsx patched successfully!");
