import React from 'react';
import Layout from "../../components/Layout.jsx";
import Logo from "../../components/Logo.jsx";
import { PhoneCall, Heart, Shield, Mic, Map, ClipboardList, BookOpen, Syringe, Star, Users, Wifi } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage.js";

const T = {
  en: {
    title: "About PashuSuraksha",
    tagline: "Protecting Every Animal. Empowering Every Farmer.",
    version: "Version 1.0  •  Made for India's Livestock Farmers",
    missionTitle: "Our Mission",
    missionText: "PashuSuraksha (पशुसुरक्षा) is a Government-aligned digital health surveillance platform built specifically for India's rural livestock farmers. We connect farmers directly to veterinary experts, provide real-time disease outbreak alerts, and maintain complete digital health records — all available offline, in your local language.",
    featuresTitle: "What You Can Do",
    features: [
      { icon: <ClipboardList size={22} color="#1565C0"/>, title: "Report Animal Illness", desc: "Submit health reports with photos and symptoms instantly. Your report reaches the local vet immediately." },
      { icon: <Syringe size={22} color="#2E7D32"/>, title: "Vaccine Passbook", desc: "Track every vaccination for every animal. Never miss a due date again." },
      { icon: <Heart size={22} color="#C62828"/>, title: "Herd Ledger", desc: "Maintain complete digital records of your entire herd — species, breed, health history." },
      { icon: <Shield size={22} color="#E65100"/>, title: "Disease Alerts", desc: "Receive early warnings when disease outbreaks are detected in your district or nearby villages." },
      { icon: <Mic size={22} color="#6A1B9A"/>, title: "Voice Assistant (AI)", desc: "Ask questions by voice in Hindi, Marathi or English. Get instant advice even if you cannot read." },
      { icon: <Map size={22} color="#00838F"/>, title: "Outbreak Map", desc: "See live disease hotspots on a map covering your area and surrounding districts." },
      { icon: <BookOpen size={22} color="#558B2F"/>, title: "Health Advisories", desc: "Read disease prevention guides for FMD, LSD, PPR, Anthrax and more — in your language." },
      { icon: <Wifi size={22} color="#757575"/>, title: "Works Offline", desc: "Reports are saved on your phone when there is no internet. They sync automatically when you reconnect." },
    ],
    statsTitle: "Protecting Livestock Across India",
    stats: [
      { value: "1,200+", label: "Farmers Registered" },
      { value: "4 States", label: "Coverage" },
      { value: "8 Diseases", label: "Monitored" },
    ],
    supportTitle: "Emergency Help",
    helpline: "National Animal Helpline",
    helplineNum: "1962",
    helplineSub: "Free • 24×7 • All Languages",
    contact: "For urgent disease cases, contact your nearest Veterinary Dispensary or Government Livestock Inspector.",
    madeWith: "Made with ❤️ for India's farmers",
  },
  hi: {
    title: "पशुसुरक्षा के बारे में",
    tagline: "हर पशु की सुरक्षा। हर किसान को शक्ति।",
    version: "संस्करण 1.0  •  भारत के पशुपालकों के लिए",
    missionTitle: "हमारा लक्ष्य",
    missionText: "पशुसुरक्षा एक डिजिटल स्वास्थ्य निगरानी मंच है जो भारत के ग्रामीण पशुपालकों के लिए बना है। हम किसानों को पशु चिकित्सकों से सीधे जोड़ते हैं, बीमारी फैलने की चेतावनी देते हैं, और डिजिटल स्वास्थ्य रिकॉर्ड रखते हैं — सब कुछ ऑफलाइन भी, आपकी भाषा में।",
    featuresTitle: "आप क्या कर सकते हैं",
    features: [
      { icon: <ClipboardList size={22} color="#1565C0"/>, title: "बीमारी की रिपोर्ट करें", desc: "लक्षण और फ़ोटो के साथ तुरंत रिपोर्ट करें। आपकी रिपोर्ट स्थानीय पशु चिकित्सक तक पहुँचती है।" },
      { icon: <Syringe size={22} color="#2E7D32"/>, title: "टीकाकरण पासबुक", desc: "हर पशु का टीकाकरण ट्रैक करें। अब कोई तारीख न चूकें।" },
      { icon: <Heart size={22} color="#C62828"/>, title: "पशु लेजर", desc: "अपने पूरे झुंड का डिजिटल रिकॉर्ड रखें — प्रजाति, नस्ल, स्वास्थ्य इतिहास।" },
      { icon: <Shield size={22} color="#E65100"/>, title: "बीमारी की चेतावनी", desc: "आपके जिले या पास के गाँवों में बीमारी फैलने पर तुरंत अलर्ट पाएं।" },
      { icon: <Mic size={22} color="#6A1B9A"/>, title: "वॉयस असिस्टेंट (AI)", desc: "हिंदी, मराठी या अंग्रेज़ी में बोलकर सवाल पूछें। पढ़ न सकें तो भी सलाह मिलेगी।" },
      { icon: <Map size={22} color="#00838F"/>, title: "प्रकोप मानचित्र", desc: "अपने क्षेत्र और आस-पास के जिलों में बीमारी के हॉटस्पॉट देखें।" },
      { icon: <BookOpen size={22} color="#558B2F"/>, title: "स्वास्थ्य सलाह", desc: "FMD, LSD, PPR, एंथ्रेक्स और अधिक के लिए रोग निवारण गाइड — आपकी भाषा में।" },
      { icon: <Wifi size={22} color="#757575"/>, title: "ऑफलाइन काम करता है", desc: "इंटरनेट न हो तो रिपोर्ट फ़ोन में सेव होती है। कनेक्ट होने पर अपने आप सिंक होती है।" },
    ],
    statsTitle: "पूरे भारत में पशुओं की सुरक्षा",
    stats: [
      { value: "1,200+", label: "किसान पंजीकृत" },
      { value: "4 राज्य", label: "कवरेज" },
      { value: "8 बीमारियाँ", label: "निगरानी में" },
    ],
    supportTitle: "आपातकालीन सहायता",
    helpline: "राष्ट्रीय पशु हेल्पलाइन",
    helplineNum: "1962",
    helplineSub: "निःशुल्क • 24×7 • सभी भाषाएँ",
    contact: "तत्काल बीमारी के मामलों में नजदीकी पशु चिकित्सालय या सरकारी पशुधन निरीक्षक से संपर्क करें।",
    madeWith: "भारत के किसानों के लिए ❤️ से बनाया गया",
  },
  mr: {
    title: "पशुसुरक्षा बद्दल",
    tagline: "प्रत्येक प्राण्याची सुरक्षा. प्रत्येक शेतकऱ्याला शक्ती.",
    version: "आवृत्ती 1.0  •  भारतातील पशुपालकांसाठी",
    missionTitle: "आमचे ध्येय",
    missionText: "पशुसुरक्षा हे भारतातील ग्रामीण पशुपालकांसाठी तयार केलेले डिजिटल आरोग्य देखरेख व्यासपीठ आहे. आम्ही शेतकऱ्यांना थेट पशुवैद्यकांशी जोडतो, रोगराईची पूर्व सूचना देतो आणि संपूर्ण डिजिटल आरोग्य नोंदी ठेवतो — सर्व ऑफलाइनही, तुमच्या भाषेत.",
    featuresTitle: "तुम्ही काय करू शकता",
    features: [
      { icon: <ClipboardList size={22} color="#1565C0"/>, title: "आजाराची नोंद करा", desc: "लक्षणे आणि फोटोसह त्वरित अहवाल द्या. तुमचा अहवाल स्थानिक पशुवैद्यकांपर्यंत पोहोचतो." },
      { icon: <Syringe size={22} color="#2E7D32"/>, title: "लसीकरण पासबुक", desc: "प्रत्येक प्राण्याचे लसीकरण ट्रॅक करा. कोणतीही तारीख चुकवू नका." },
      { icon: <Heart size={22} color="#C62828"/>, title: "पशु खाते", desc: "तुमच्या संपूर्ण कळपाच्या डिजिटल नोंदी ठेवा — प्रजाती, जाती, आरोग्य इतिहास." },
      { icon: <Shield size={22} color="#E65100"/>, title: "रोग इशारे", desc: "तुमच्या जिल्ह्यात किंवा जवळच्या गावांमध्ये रोगराई आढळल्यास त्वरित सूचना मिळवा." },
      { icon: <Mic size={22} color="#6A1B9A"/>, title: "व्हॉइस असिस्टंट (AI)", desc: "हिंदी, मराठी किंवा इंग्रजीत बोलून प्रश्न विचारा. वाचता नाही आले तरी सल्ला मिळेल." },
      { icon: <Map size={22} color="#00838F"/>, title: "प्रादुर्भाव नकाशा", desc: "तुमच्या परिसरातील रोगाचे हॉटस्पॉट नकाशावर पाहा." },
      { icon: <BookOpen size={22} color="#558B2F"/>, title: "आरोग्य सल्ला", desc: "FMD, LSD, PPR, अँथ्रॅक्स साठी रोग प्रतिबंधक मार्गदर्शिका — तुमच्या भाषेत." },
      { icon: <Wifi size={22} color="#757575"/>, title: "ऑफलाइन काम करते", desc: "इंटरनेट नसताना अहवाल फोनमध्ये साठवले जातात. कनेक्ट झाल्यावर आपोआप सिंक होतात." },
    ],
    statsTitle: "संपूर्ण भारतात पशुधनाचे संरक्षण",
    stats: [
      { value: "1,200+", label: "नोंदणीकृत शेतकरी" },
      { value: "4 राज्ये", label: "व्याप्ती" },
      { value: "8 रोग", label: "देखरेखीत" },
    ],
    supportTitle: "आपत्कालीन मदत",
    helpline: "राष्ट्रीय पशु हेल्पलाइन",
    helplineNum: "1962",
    helplineSub: "मोफत • 24×7 • सर्व भाषा",
    contact: "तातडीच्या रोगाच्या प्रकरणांसाठी जवळच्या पशुवैद्यकीय दवाखान्याशी किंवा सरकारी पशुधन निरीक्षकाशी संपर्क साधा.",
    madeWith: "भारतातील शेतकऱ्यांसाठी ❤️ ने बनवले",
  }
};

export default function About() {
  const { lang, setLang } = useLanguage();
  const t = T[lang] || T.en;

  return (
    <Layout title={t.title} showBack lang={lang} setLang={setLang}>
      <div style={{ paddingBottom: '100px' }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
          padding: "36px 24px 32px",
          textAlign: "center",
          color: "white"
        }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:"20px", padding:"16px" }}>
              <Logo size={56} color="white" />
            </div>
          </div>
          <h1 style={{ margin:"0 0 6px 0", fontSize:"26px", fontWeight:"800", letterSpacing:"-0.5px" }}>PashuSuraksha</h1>
          <p style={{ margin:"0 0 12px 0", fontSize:"14px", opacity:0.9, fontWeight:"500" }}>{t.tagline}</p>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,0.15)", borderRadius:"20px", padding:"4px 14px", fontSize:"12px", opacity:0.85 }}>
            {t.version}
          </div>
        </div>

        <div className="page-content" style={{ paddingTop:"20px" }}>

          {/* ── Stats Row ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"24px" }}>
            {t.stats.map((s,i) => (
              <div key={i} style={{
                background:"white", borderRadius:"14px", padding:"16px 8px",
                textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                border:"1px solid #f0f0f0"
              }}>
                <div style={{ fontSize:"20px", fontWeight:"800", color:"#1B5E20" }}>{s.value}</div>
                <div style={{ fontSize:"11px", color:"#888", fontWeight:"600", marginTop:"4px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Mission ── */}
          <div style={{ background:"#E8F5E9", borderRadius:"16px", padding:"20px", marginBottom:"24px", borderLeft:"5px solid #2E7D32" }}>
            <div style={{ fontSize:"12px", fontWeight:"700", color:"#2E7D32", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>{t.missionTitle}</div>
            <p style={{ margin:0, fontSize:"14px", color:"#2d4a2d", lineHeight:"1.7" }}>{t.missionText}</p>
          </div>

          {/* ── Features ── */}
          <div style={{ fontSize:"13px", fontWeight:"700", color:"#555", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>{t.featuresTitle}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
            {t.features.map((f, i) => (
              <div key={i} style={{
                background:"white", borderRadius:"12px", padding:"14px 16px",
                display:"flex", alignItems:"flex-start", gap:"14px",
                boxShadow:"0 2px 6px rgba(0,0,0,0.04)", border:"1px solid #f0f0f0"
              }}>
                <div style={{ background:"#f5f5f5", borderRadius:"10px", padding:"8px", flexShrink:0, marginTop:"2px" }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:"#222", marginBottom:"3px" }}>{f.title}</div>
                  <div style={{ fontSize:"13px", color:"#666", lineHeight:"1.5" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Emergency Helpline ── */}
          <div style={{ fontSize:"13px", fontWeight:"700", color:"#555", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>{t.supportTitle}</div>
          <div style={{
            background:"linear-gradient(135deg, #1B5E20, #2E7D32)",
            borderRadius:"16px", padding:"24px", marginBottom:"16px",
            textAlign:"center", color:"white"
          }}>
            <PhoneCall size={32} color="white" style={{ marginBottom:"10px" }} />
            <div style={{ fontSize:"14px", fontWeight:"600", opacity:0.85, marginBottom:"6px" }}>{t.helpline}</div>
            <div style={{ fontSize:"44px", fontWeight:"900", letterSpacing:"4px", marginBottom:"6px" }}>{t.helplineNum}</div>
            <div style={{ fontSize:"12px", opacity:0.8, background:"rgba(255,255,255,0.15)", display:"inline-block", padding:"3px 12px", borderRadius:"20px" }}>{t.helplineSub}</div>
          </div>
          <p style={{ fontSize:"13px", color:"#666", lineHeight:"1.6", textAlign:"center", marginBottom:"24px" }}>{t.contact}</p>

          {/* ── Footer ── */}
          <div style={{ textAlign:"center", paddingTop:"8px", borderTop:"1px solid #eee" }}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
              <Logo size={20} color="#2E7D32" />
              <span style={{ fontSize:"14px", fontWeight:"700", color:"#1B5E20" }}>PashuSuraksha</span>
            </div>
            <div style={{ fontSize:"12px", color:"#aaa" }}>{t.madeWith}</div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
