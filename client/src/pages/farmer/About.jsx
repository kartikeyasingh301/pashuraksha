import React from 'react';
import Layout from "../../components/Layout.jsx";
import { Info, Shield, PhoneCall, Heart } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage.js";

const TRANSLATIONS = {
  en: {
    title: "About PashuSuraksha",
    mission: "Our Mission",
    missionText: "PashuSuraksha aims to protect your livestock and secure your livelihood. We provide early warning systems for diseases, digital health records, and direct connections to veterinary experts.",
    features: "Key Features",
    f1: "Track your herd's health and vaccinations",
    f2: "Report illnesses instantly to local vets",
    f3: "Receive localized disease outbreak alerts",
    f4: "Voice-enabled AI assistant for immediate advice",
    support: "Help & Support",
    helpline: "National Animal Helpline: 1962",
    contact: "Contact your local veterinary officer for urgent cases."
  },
  hi: {
    title: "पशुसुरक्षा के बारे में",
    mission: "हमारा लक्ष्य",
    missionText: "पशुसुरक्षा का उद्देश्य आपके पशुओं की रक्षा करना और आपकी आजीविका को सुरक्षित करना है। हम बीमारियों के लिए प्रारंभिक चेतावनी, डिजिटल स्वास्थ्य रिकॉर्ड और पशु चिकित्सा विशेषज्ञों से सीधा संपर्क प्रदान करते हैं।",
    features: "प्रमुख विशेषताएं",
    f1: "अपने पशुओं के स्वास्थ्य और टीकाकरण को ट्रैक करें",
    f2: "स्थानीय पशु चिकित्सक को तुरंत बीमारी की रिपोर्ट करें",
    f3: "स्थानीय बीमारी फैलने की चेतावनी प्राप्त करें",
    f4: "तत्काल सलाह के लिए एआई वॉयस असिस्टेंट",
    support: "सहायता और समर्थन",
    helpline: "राष्ट्रीय पशु हेल्पलाइन: 1962",
    contact: "तत्काल मामलों के लिए अपने स्थानीय पशु चिकित्सा अधिकारी से संपर्क करें।"
  },
  mr: {
    title: "पशुसुरक्षा बद्दल",
    mission: "आमचे ध्येय",
    missionText: "पशुसुरक्षाचे उद्दिष्ट तुमच्या पशुधनाचे रक्षण करणे आणि तुमची उपजीविका सुरक्षित करणे हे आहे. आम्ही आजारांसाठी पूर्व चेतावणी प्रणाली, डिजिटल आरोग्य रेकॉर्ड आणि पशुवैद्यकीय तज्ञांशी थेट संपर्क प्रदान करतो.",
    features: "प्रमुख वैशिष्ट्ये",
    f1: "तुमच्या प्राण्यांच्या आरोग्य आणि लसीकरणाचा मागोवा घ्या",
    f2: "स्थानिक पशुवैद्यकांना आजाराची त्वरित माहिती द्या",
    f3: "स्थानिक रोगराईच्या धोक्याच्या सूचना मिळवा",
    f4: "तात्काळ सल्ल्यासाठी एआय व्हॉइस असिस्टंट",
    support: "मदत आणि समर्थन",
    helpline: "राष्ट्रीय पशु हेल्पलाइन: १९६२",
    contact: "तातडीच्या प्रकरणांसाठी तुमच्या स्थानिक पशुवैद्यकीय अधिकाऱ्याशी संपर्क साधा."
  }
};

export default function About() {
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <Layout title={t.title} showBack lang={lang} setLang={setLang}>
      <div className="page-content" style={{ paddingBottom: '100px' }}>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <Shield size={48} color="#2E7D32" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ margin: "0 0 12px 0", color: "#1B5E20", fontSize: "22px" }}>PashuSuraksha</h2>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.6", fontSize: "15px" }}>{t.missionText}</p>
        </div>

        <h3 style={{ fontSize: "16px", color: "#1B5E20", marginBottom: "12px", marginLeft: "4px" }}>{t.features}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <Heart color="#C62828" size={24} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{t.f1}</span>
          </div>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <Shield color="#1565C0" size={24} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{t.f3}</span>
          </div>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <PhoneCall color="#2E7D32" size={24} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{t.f4}</span>
          </div>
        </div>

        <h3 style={{ fontSize: "16px", color: "#1B5E20", marginBottom: "12px", marginLeft: "4px" }}>{t.support}</h3>
        <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: "16px", padding: "20px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2E7D32", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <PhoneCall size={20} />
            {t.helpline}
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: "1.5" }}>{t.contact}</p>
        </div>

      </div>
    </Layout>
  );
}
