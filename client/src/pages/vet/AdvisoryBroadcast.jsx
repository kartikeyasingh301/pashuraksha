import React, { useState } from "react";
import { Send, MapPin, MessageSquare, Globe, CheckCircle, Bell } from "lucide-react";
import Layout from "../../components/Layout.jsx";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
];

const TEMPLATES = {
  fmd: {
    en: "FMD suspected within 10 km of your village. Isolate affected cattle immediately, avoid shared water troughs, and notify your field worker.",
    hi: "आपके गाँव के 10 किमी के भीतर FMD संभावित है। प्रभावित मवेशियों को तुरंत अलग करें, साझा पानी के कुंड से बचें और अपने फील्ड कार्यकर्ता को सूचित करें।",
    mr: "तुमच्या गावाच्या 10 किमी मध्ये FMD संशयित आहे. बाधित जनावरांना तात्काळ वेगळे करा, सामायिक पाण्याचे कुंड टाळा आणि तुमच्या फील्ड कर्मचाऱ्याला कळवा.",
  },
  anthrax: {
    en: "URGENT: Anthrax suspected in your district. Do NOT touch dead animals with bare hands. Burn and bury carcasses. Call the veterinary helpline immediately: 1962.",
    hi: "तत्काल: आपके जिले में एंथ्रेक्स संभावित है। मृत जानवरों को नंगे हाथों से न छुएं। शवों को जलाएं और दफनाएं। पशु चिकित्सा हेल्पलाइन पर तुरंत कॉल करें: 1962।",
    mr: "तात्काळ: तुमच्या जिल्ह्यात अँथ्रॅक्स संशयित आहे. मृत जनावरांना उघड्या हातांनी स्पर्श करू नका. मृतदेह जाळून पुरा. पशुवैद्यकीय हेल्पलाइनवर त्वरित कॉल करा: 1962.",
  },
  ppr: {
    en: "PPR (Goat Plague) detected nearby. Separate sick goats and sheep from the herd. Do not sell or move animals to other markets. Contact the nearest vet.",
    hi: "आसपास PPR (बकरी प्लेग) का पता चला है। बीमार बकरियों और भेड़ों को झुंड से अलग करें। जानवरों को अन्य बाजारों में न बेचें या न ले जाएं। नजदीकी पशु चिकित्सक से संपर्क करें।",
    mr: "जवळपास PPR (बकरी प्लेग) आढळला आहे. आजारी शेळ्या व मेंढ्यांना कळपातून वेगळे करा. जनावरांना इतर बाजारात विकू नका. जवळच्या पशुवैद्याशी संपर्क साधा.",
  },
};

export default function AdvisoryBroadcast() {
  const [template, setTemplate] = useState("fmd");
  const [target, setTarget] = useState("radius");
  const [langs, setLangs] = useState(["en", "hi", "mr"]);
  const [sent, setSent] = useState(false);

  const toggleLang = (code) => {
    setLangs(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const cardStyle = { background: "white", borderRadius: "14px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: "16px", border: "1px solid #f0f0f0" };

  return (
    <Layout title="Advisory Broadcast" showBack>
      <div className="page-content" style={{ paddingBottom: "120px" }}>
        
        {sent && (
          <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", color: "#2E7D32", padding: "16px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={24} />
            <div>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Broadcast Sent Successfully</h4>
              <p style={{ margin: 0, fontSize: "13px", marginTop: "4px" }}>Delivered to ~4,250 registered farmers via SMS and WhatsApp in 3 languages.</p>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1B5E20", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={18} /> Target Audience</h3>
          <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid #e0e0e0", borderRadius: "8px", background: target === "radius" ? "#E8F5E9" : "white", cursor: "pointer" }}>
              <input type="radio" name="target" checked={target === "radius"} onChange={() => setTarget("radius")} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>Radius 10km (Gondal)</div>
                <div style={{ fontSize: "12px", color: "#666" }}>Target farmers near active outbreak</div>
              </div>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid #e0e0e0", borderRadius: "8px", background: target === "district" ? "#E8F5E9" : "white", cursor: "pointer" }}>
              <input type="radio" name="target" checked={target === "district"} onChange={() => setTarget("district")} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>Entire District (Nashik)</div>
                <div style={{ fontSize: "12px", color: "#666" }}>General advisory broadcast</div>
              </div>
            </label>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1B5E20", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px" }}><Globe size={18} /> Languages</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => toggleLang(l.code)} style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid", 
                borderColor: langs.includes(l.code) ? "#2E7D32" : "#e0e0e0",
                background: langs.includes(l.code) ? "#E8F5E9" : "white",
                color: langs.includes(l.code) ? "#1B5E20" : "#666",
                fontWeight: "600", fontSize: "13px", cursor: "pointer"
              }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1B5E20", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px" }}><MessageSquare size={18} /> Message Template</h3>
          <select value={template} onChange={e => setTemplate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0", marginBottom: "16px", fontSize: "14px", outline: "none" }}>
            <option value="fmd">FMD Outbreak Alert</option>
            <option value="anthrax">Anthrax Emergency</option>
            <option value="ppr">PPR / Goat Plague</option>
          </select>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {langs.map(l => (
              <div key={l} style={{ padding: "12px", background: "#F5F5F5", borderRadius: "8px", borderLeft: "4px solid #2E7D32" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#1B5E20", marginBottom: "4px", textTransform: "uppercase" }}>{LANGUAGES.find(x => x.code === l)?.label}</div>
                <div style={{ fontSize: "13px", color: "#333", lineHeight: "1.5" }}>{TEMPLATES[template][l] || TEMPLATES[template].en}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSend} disabled={langs.length === 0 || sent} style={{ width: "100%", padding: "16px", background: sent ? "#9E9E9E" : "#1B5E20", color: "white", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: sent ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(27,94,32,0.3)" }}>
          <Send size={20} />
          {sent ? "Sent!" : "Send Multilingual Broadcast"}
        </button>

      </div>
    </Layout>
  );
}
