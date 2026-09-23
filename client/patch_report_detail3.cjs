const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportDetail.jsx';
let code = fs.readFileSync(file, 'utf8');

const completeTranslationBlock = `
const TRANSLATIONS = {
  en: {
    back: "Back to Dashboard",
    title: "Detailed Health Report",
    loading: "Loading report details...",
    error: "Could not load report.",
    status: "Current Status",
    symptoms: "Reported Symptoms",
    location: "Location",
    species: "Animal Species",
    syndrome: "Suspected Disease",
    date: "Reported On",
    mortality: "Animal Deaths",
    mortalityNone: "None reported",
    vaccination: "Vaccination Status",
    vaccinationUnknown: "Unknown",
    vaccinationYes: "Vaccinated",
    vaccinationNo: "Not Vaccinated",
    notes: "Veterinarian Notes",
    notesNone: "No notes attached yet",
    id: "Report Tracking ID"
  },
  hi: {
    back: "डैशबोर्ड पर वापस जाएं",
    title: "विस्तृत स्वास्थ्य रिपोर्ट",
    loading: "रिपोर्ट लोड हो रही है...",
    error: "रिपोर्ट लोड नहीं हो सकी।",
    status: "वर्तमान स्थिति",
    symptoms: "दर्ज किए गए लक्षण",
    location: "स्थान",
    species: "पशु",
    syndrome: "संभावित बीमारी",
    date: "रिपोर्ट करने की तिथि",
    mortality: "पशुओं की मृत्यु",
    mortalityNone: "कोई मृत्यु दर्ज नहीं",
    vaccination: "टीकाकरण की स्थिति",
    vaccinationUnknown: "अज्ञात",
    vaccinationYes: "टीका लगा है",
    vaccinationNo: "टीका नहीं लगा है",
    notes: "डॉक्टर की टिप्पणी",
    notesNone: "अभी तक कोई टिप्पणी नहीं",
    id: "रिपोर्ट ट्रैकिंग आईडी"
  },
  mr: {
    back: "डॅशबोर्डवर परत जा",
    title: "सविस्तर आरोग्य अहवाल",
    loading: "अहवाल लोड होत आहे...",
    error: "अहवाल लोड होऊ शकला नाही.",
    status: "सद्य स्थिती",
    symptoms: "नोंदवलेली लक्षणे",
    location: "स्थान",
    species: "प्राणी",
    syndrome: "संभाव्य आजार",
    date: "अहवाल दिल्याची तारीख",
    mortality: "प्राण्यांचा मृत्यू",
    mortalityNone: "कोणताही मृत्यू नोंदवला नाही",
    vaccination: "लसीकरणाची स्थिती",
    vaccinationUnknown: "माहित नाही",
    vaccinationYes: "लसीकरण झाले आहे",
    vaccinationNo: "लसीकरण झालेले नाही",
    notes: "डॉक्टरांची नोंद",
    notesNone: "अद्याप कोणतीही नोंद नाही",
    id: "अहवाल ट्रॅकिंग आयडी"
  }
};

const getTranslatedDisease = (disease, lang) => {
  if (!disease) return "Unknown";
  const d = disease.toUpperCase();
  if (lang === 'hi') {
    if (d.includes('FMD') || d.includes('FOOT')) return 'खुरपका-मुँहपका रोग (FMD)';
    if (d.includes('LSD') || d.includes('LUMPY')) return 'लंपी त्वचा रोग (LSD)';
    if (d.includes('PPR')) return 'पीपीआर (बकरी प्लेग)';
    if (d.includes('MASTITIS')) return 'थनैला रोग (Mastitis)';
    if (d.includes('BQ') || d.includes('BLACK')) return 'लंगड़ा बुखार (Black Quarter)';
    if (d.includes('ANTHRAX')) return 'गिल्टी रोग (Anthrax)';
  }
  if (lang === 'mr') {
    if (d.includes('FMD') || d.includes('FOOT')) return 'लाळ्या खुरकूत (FMD)';
    if (d.includes('LSD') || d.includes('LUMPY')) return 'लंपी स्किन डिसीज (LSD)';
    if (d.includes('PPR')) return 'पीपीआर (शेळ्यांचा प्लेग)';
    if (d.includes('MASTITIS')) return 'मस्टायटीस (सडाचा आजार)';
    if (d.includes('BQ') || d.includes('BLACK')) return 'फऱ्या (Black Quarter)';
    if (d.includes('ANTHRAX')) return 'अँथ्रॅक्स';
  }
  return disease;
};
`;

code = code.replace(/const TRANSLATIONS = {[\s\S]*?};\n/, completeTranslationBlock);

const detailedUI = `
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
            <div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>{t.syndrome}</div>
              <strong style={{ fontSize: "20px", color: "#111" }}>{getTranslatedDisease(report.syndrome || report.disease, lang)}</strong>
            </div>
            <div style={{ background: getStatusColor(report.status), color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>
              {getTranslatedStatus(report.status)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", color: "#2E7D32" }}>
                <Activity size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.species}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{report.species} {report.animal_id ? \` (Tag: \${report.animal_id})\` : ''}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", color: "#F57C00" }}>
                <AlertCircle size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.symptoms}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{report.symptoms || "None specified"}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FFEBEE", display: "flex", alignItems: "center", justifyContent: "center", color: "#C62828" }}>
                <ShieldAlert size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.mortality}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: report.mortality_count > 0 ? "#C62828" : "#222" }}>
                  {report.mortality_count > 0 ? \`\${report.mortality_count} Dead\` : t.mortalityNone}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", color: "#1565C0" }}>
                <MapPin size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.location}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{report.village}, {report.district}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F3E5F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#7B1FA2" }}>
                <Clock size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.date}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{formatKolkataTime(report.captured_at || report.capturedAt)}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "8px", background: "#FAFAFA", padding: "12px", borderRadius: "10px", border: "1px dashed #ccc" }}>
              <FileText size={20} color="#757575" style={{ marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.notes}</div>
                <div style={{ fontSize: "14px", color: "#333", fontStyle: report.notes ? "normal" : "italic", marginTop: "4px" }}>
                  {report.notes || t.notesNone}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: "10px", textAlign: "center", fontSize: "11px", color: "#aaa" }}>
              {t.id}: {report.id || report.local_id || report.localId}
            </div>

          </div>
        </div>
`;

code = code.replace(/<div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 15px rgba\(0,0,0,0\.05\)" }}>[\s\S]*?<\/div>\s*<\/div>\s*\)\s*;\s*}/, detailedUI + '\n      )}\n    </div>\n  );\n}');

fs.writeFileSync(file, code);
console.log("ReportDetail full detail patched");
