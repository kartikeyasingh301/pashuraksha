const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

// I need to replace the entire `<form>` tag contents.
const formStart = '<form onSubmit={handleSubmit} className="report-form" noValidate>';
const formEnd = '</form>';

const startIndex = code.indexOf(formStart);
const endIndex = code.indexOf(formEnd) + formEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newForm = `<form onSubmit={handleSubmit} className="report-form" noValidate>
            
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1B5E20", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <Info size={18}/> Herd & Demographics
              </h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="species">{t.lblSpecies}</label>
                <select id="species" name="species" className={"form-control" + (errors.species ? " form-control-error" : "")} value={form.species} onChange={handleChange}>
                  <option value="">{t.selSpecies}</option>
                  {SPECIES_LIST.map((s) => <option key={s} value={s}>{t.species[s] || s}</option>)}
                </select>
                {errors.species && <span className="form-error">{errors.species}</span>}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t.lblHerdSize || "Herd Size"}</label>
                  <input name="herdSize" type="number" min="0" className="form-control" value={form.herdSize} onChange={handleChange} placeholder="e.g. 50" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t.lblAnimalId}</label>
                  <input name="animalId" type="text" className="form-control" value={form.animalId} onChange={handleChange} placeholder={t.phAnimalId} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t.lblVillage}</label>
                <input name="village" type="text" className={"form-control" + (errors.village ? " form-control-error" : "")} value={form.village} onChange={handleChange} placeholder={t.phVillage} />
                {errors.village && <span className="form-error">{errors.village}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblGps}</label>
                <button type="button" className="btn btn-outline btn-block" onClick={getLocation} disabled={locLoading}>
                  {locLoading ? <Loader size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {locLoading ? t.btnLocLoading : t.btnLocGet}
                </button>
                {location.lat && location.lng && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "#2E7D32", fontSize: "13px", fontWeight: "700", background: "#E8F5E9", padding: "8px 12px", borderRadius: "8px" }}>
                    <CheckCircle size={16} /> GPS Recorded: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#C62828", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <Activity size={18}/> Clinical Assessment
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="syndrome">{t.lblSyndrome}</label>
                <select id="syndrome" name="syndrome" className={"form-control" + (errors.syndrome ? " form-control-error" : "")} value={form.syndrome} onChange={handleChange}>
                  <option value="">{t.selSyndrome}</option>
                  {SYNDROME_LIST.map((s) => <option key={s} value={s}>{t.syndrome[s] || s}</option>)}
                </select>
                {errors.syndrome && <span className="form-error">{errors.syndrome}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblOnsetDate || "Symptom Onset Date"}</label>
                <input name="onsetDate" type="date" className="form-control" value={form.onsetDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblSymptoms}</label>
                <div className="symptom-grid">
                  {SYMPTOM_LIST.map((symptom) => (
                    <label key={symptom} className={"symptom-chip" + (form.symptoms.includes(symptom) ? " selected" : "")}>
                      <input type="checkbox" checked={form.symptoms.includes(symptom)} onChange={() => handleSymptomToggle(symptom)} className="symptom-check-input" />
                      {t.symptoms[symptom] || symptom}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblMortality}</label>
                <input name="mortalityCount" type="number" min="0" className="form-control" value={form.mortalityCount} onChange={handleChange} />
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1565C0", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                 <ShieldAlert size={18}/> Epidemiological Context
              </h3>

              <div className="form-group">
                <label className="form-label">{t.lblVaccine}</label>
                <select name="vaccinationStatus" className="form-control" value={form.vaccinationStatus} onChange={handleChange}>
                  {VACCINE_LIST.map((v) => <option key={v} value={v}>{t.vaccine[v] || v}</option>)}
                </select>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                 <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#333", cursor: "pointer" }}>
                    <input type="checkbox" name="recentMovement" checked={form.recentMovement} onChange={(e) => setForm(p => ({...p, recentMovement: e.target.checked}))} style={{ width: "18px", height: "18px", accentColor: "#1565C0" }} />
                    {t.lblRecentMovement || "Recent animal movement off-farm?"}
                 </label>
                 <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#333", cursor: "pointer" }}>
                    <input type="checkbox" name="newAnimals" checked={form.newAnimals} onChange={(e) => setForm(p => ({...p, newAnimals: e.target.checked}))} style={{ width: "18px", height: "18px", accentColor: "#1565C0" }} />
                    {t.lblNewAnimals || "New animals introduced recently?"}
                 </label>
              </div>

              <div className="form-group">
                <label className="form-label">{t.lblNotes}</label>
                <textarea name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} placeholder={t.phNotes} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: "14px", fontSize: "16px", marginBottom: "20px" }} disabled={submitting}>
              {submitting ? <Loader size={20} className="animate-spin" /> : (isOnline ? <Send size={20} /> : <Save size={20} />)}
              <span style={{ marginLeft: "8px" }}>{submitting ? t.btnSubmitting : (isOnline ? t.btnSubmit : t.btnSaveOffline)}</span>
            </button>
          </form>`;
  
  code = code.substring(0, startIndex) + newForm + code.substring(endIndex);
  fs.writeFileSync(file, code, 'utf8');
  console.log('Form restyled into professional sections!');
} else {
  console.log('Could not find form block');
}
