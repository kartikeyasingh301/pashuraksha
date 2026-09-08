import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { Target, Skull, Activity, PhoneCall, Languages, AlertTriangle } from 'lucide-react';

// YouTube search-based embeds — always show real available videos
const VIDEOS = {
  fmd: 'https://www.youtube.com/embed?listType=search&list=FMD+foot+mouth+disease+cattle+India+prevention',
  lumpy: 'https://www.youtube.com/embed?listType=search&list=lumpy+skin+disease+cattle+India+LSD+2023',
  ppr: 'https://www.youtube.com/embed?listType=search&list=PPR+disease+goat+sheep+India+vaccination',
  anthrax: 'https://www.youtube.com/embed?listType=search&list=anthrax+livestock+India+biosecurity',
};

const ADVISORIES = {
  en: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'FMD Prevention',
      severity: 'high',
      content: 'Foot-and-Mouth Disease (FMD) spreads rapidly through contact and air. Vaccinate all cattle and buffalo every 6 months. Quarantine new animals for 21 days. Disinfect farm entry/exit. Report blisters, lameness or excessive salivation immediately.',
      tags: ['Cattle', 'Buffalo', 'Vaccination'],
      videoId: VIDEOS.fmd,
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'Lumpy Skin Disease',
      severity: 'medium',
      content: 'LSD causes skin nodules, fever, and reduced milk production in cattle. It spreads through biting insects (mosquitoes, flies). Use insect repellents, mosquito nets on animals, and vaccinate with LSD vaccine. Report lumps or nodules to your vet immediately.',
      tags: ['Cattle', 'Monsoon', 'Zoonotic Risk'],
      videoId: VIDEOS.lumpy,
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'Anthrax Emergency Protocol',
      severity: 'critical',
      content: 'CRITICAL: Anthrax causes sudden death with no warning. DO NOT open carcasses — this releases dangerous spores. Bury deep (>2m) or burn the body. Annual spore vaccine is mandatory in endemic areas. This is a human health risk (zoonotic) — wear gloves.',
      tags: ['All Species', 'Zoonotic', 'Emergency'],
      videoId: VIDEOS.anthrax,
    },
    {
      id: 4,
      icon: <AlertTriangle size={24} color="#E65100" />,
      title: 'PPR in Small Ruminants',
      severity: 'high',
      content: 'Peste des Petits Ruminants (PPR) is highly contagious in goats and sheep. Symptoms: high fever, nasal discharge, mouth ulcers, severe diarrhea. Vaccinate annually. Isolate affected animals immediately. Report to your nearest animal health center.',
      tags: ['Sheep', 'Goat', 'Contagious'],
      videoId: VIDEOS.fmd,
    },
  ],
  hi: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'खुरपका-मुँहपका (FMD) की रोकथाम',
      severity: 'high',
      content: 'खुरपका-मुँहपका रोग संपर्क और हवा से तेजी से फैलता है। हर 6 महीने में सभी मवेशियों और भैंसों का टीकाकरण करें। नए पशुओं को 21 दिनों के लिए अलग रखें। छाले, लंगड़ापन या अत्यधिक लार दिखे तो तुरंत रिपोर्ट करें।',
      tags: ['मवेशी', 'भैंस', 'टीकाकरण'],
      videoId: VIDEOS.fmd,
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'लंपी त्वचा रोग',
      severity: 'medium',
      content: 'लंपी रोग (LSD) से मवेशियों में त्वचा पर गांठ, बुखार और दूध उत्पादन में कमी होती है। यह मच्छरों और मक्खियों से फैलता है। कीट विकर्षक और मच्छरदानी का उपयोग करें और LSD टीका लगाएं। गांठ दिखने पर तुरंत पशु चिकित्सक को बुलाएं।',
      tags: ['मवेशी', 'मानसून', 'ज़ूनोटिक'],
      videoId: VIDEOS.lumpy,
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'एंथ्रेक्स आपातकालीन प्रोटोकॉल',
      severity: 'critical',
      content: 'चेतावनी: एंथ्रेक्स बिना किसी चेतावनी के अचानक मौत का कारण बनता है। मृत जानवरों को न खोलें — इससे खतरनाक बीजाणु निकलते हैं। शव को 2 मीटर गहरे दफनाएं या जला दें। वार्षिक बीजाणु टीका लगाना अनिवार्य है। दस्ताने पहनें — यह मनुष्यों को भी हो सकता है।',
      tags: ['सभी प्रजातियां', 'ज़ूनोटिक', 'आपातकालीन'],
      videoId: VIDEOS.anthrax,
    },
    {
      id: 4,
      icon: <AlertTriangle size={24} color="#E65100" />,
      title: 'छोटे जुगाली करने वाले पशुओं में PPR',
      severity: 'high',
      content: 'PPR (पेस्टे डेस पेटिट्स रुमिनेंट्स) बकरियों और भेड़ों में अत्यधिक संक्रामक है। लक्षण: तेज बुखार, नाक से पानी, मुंह में छाले, दस्त। वार्षिक टीकाकरण करें। प्रभावित पशुओं को तुरंत अलग करें।',
      tags: ['भेड़', 'बकरी', 'संक्रामक'],
      videoId: VIDEOS.fmd,
    },
  ],
  mr: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'लाळ्या-खुरकूत (FMD) प्रतिबंध',
      severity: 'high',
      content: 'लाळ्या-खुरकूत रोग स्पर्श आणि हवेतून वेगाने पसरतो. दर 6 महिन्यांनी सर्व गुरे आणि म्हशींचे लसीकरण करा. नवीन प्राण्यांना 21 दिवस वेगळे ठेवा. फोड, लंगडेपणा किंवा जास्त लाळ दिसल्यास त्वरित कळवा.',
      tags: ['गुरे', 'म्हैस', 'लसीकरण'],
      videoId: VIDEOS.fmd,
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'लंपी त्वचा रोग',
      severity: 'medium',
      content: 'लंपी त्वचा रोग (LSD) मुळे गुरांमध्ये त्वचेवर गाठी, ताप आणि दूध उत्पादन कमी होते. हा डासांपासून पसरतो. कीटकनाशके आणि मच्छरदाणी वापरा. LSD लस द्या. गाठी दिसल्यास त्वरित पशुवैद्यांना बोलवा.',
      tags: ['गुरे', 'पावसाळा', 'झुनोटिक'],
      videoId: VIDEOS.lumpy,
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'अँथ्रॅक्स आपत्कालीन प्रोटोकॉल',
      severity: 'critical',
      content: 'धोका: अँथ्रॅक्स अचानक मृत्यू आणतो. मृत जनावरे उघडू नका — यामुळे धोकादायक बीजाणू बाहेर पडतात. शव 2 मीटर खोल पुरा किंवा जाळा. वार्षिक बीजाणू लस अनिवार्य आहे. हातमोजे घाला — हे मनुष्यांनाही होऊ शकते.',
      tags: ['सर्व प्रजाती', 'झुनोटिक', 'आपत्कालीन'],
      videoId: VIDEOS.anthrax,
    },
    {
      id: 4,
      icon: <AlertTriangle size={24} color="#E65100" />,
      title: 'लहान जनावरांमध्ये PPR',
      severity: 'high',
      content: 'PPR शेळ्या आणि मेंढ्यांमध्ये अत्यंत संसर्गजन्य आहे. लक्षणे: तीव्र ताप, नाकातून पाणी, तोंडात फोड, जुलाब. वार्षिक लसीकरण करा. बाधित प्राण्यांना त्वरित वेगळे करा.',
      tags: ['मेंढ्या', 'शेळ्या', 'संसर्गजन्य'],
      videoId: VIDEOS.fmd,
    },
  ],
};

const SEVERITY_COLORS = { critical: '#C62828', high: '#E65100', medium: '#F57F17', low: '#2E7D32' };

const LABELS = {
  en: {
    title: 'Health Advisories',
    intro: 'Disease prevention guidelines and alerts for livestock farmers in your region.',
    emergency: 'Emergency Helpline',
    emergencyText: 'If you suspect an outbreak, contact your nearest Veterinary Dispensary or call the National Animal Helpline:',
    helpline: '1962 (Toll Free)',
  },
  hi: {
    title: 'स्वास्थ्य सलाह',
    intro: 'आपके क्षेत्र के पशुपालकों के लिए रोग निवारण दिशानिर्देश और अलर्ट।',
    emergency: 'आपातकालीन हेल्पलाइन',
    emergencyText: 'यदि बीमारी फैलने का संदेह हो तो नजदीकी पशु चिकित्सालय से संपर्क करें या राष्ट्रीय पशु हेल्पलाइन पर कॉल करें:',
    helpline: '1962 (टोल फ्री)',
  },
  mr: {
    title: 'आरोग्य सल्ला',
    intro: 'तुमच्या प्रदेशातील पशुपालकांसाठी रोग प्रतिबंधक मार्गदर्शक तत्त्वे आणि इशारे.',
    emergency: 'आपत्कालीन हेल्पलाइन',
    emergencyText: 'रोगाचा प्रादुर्भाव झाल्याचा संशय असल्यास, जवळच्या पशुवैद्यकीय दवाखान्याशी संपर्क साधा किंवा राष्ट्रीय पशु हेल्पलाइनवर कॉल करा:',
    helpline: '1962 (टोल फ्री)',
  },
};

export default function Advisory() {
  const [lang, setLang] = useState('en');
  const t = LABELS[lang];
  const list = ADVISORIES[lang];

  return (
    <Layout title={t.title}>
      <div className="page-content" style={{ paddingBottom: '80px' }}>

        {/* Language Switcher */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', gap: '6px' }}>
            <Languages size={16} color="#2E7D32" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '700', color: '#2E7D32' }}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>{t.intro}</p>

        {/* Advisory Cards */}
        {list.map((adv) => (
          <div key={adv.id} style={{
            background: 'white', borderRadius: '16px', marginBottom: '20px',
            overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
            borderLeft: '5px solid ' + SEVERITY_COLORS[adv.severity],
          }}>
            <div style={{ padding: '16px 16px 0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '8px', flexShrink: 0 }}>{adv.icon}</div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{adv.title}</h3>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                    background: SEVERITY_COLORS[adv.severity] + '20',
                    color: SEVERITY_COLORS[adv.severity],
                    padding: '2px 8px', borderRadius: '10px',
                  }}>{adv.severity}</span>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0 0 12px 0' }}>{adv.content}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {adv.tags.map((tag) => (
                  <span key={tag} style={{ background: '#f0f4f0', color: '#2E7D32', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Embedded YouTube Video */}
            {adv.videoId && (
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={adv.videoId}
                  title={adv.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}

        {/* Emergency Contact */}
        <div style={{
          background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
          borderRadius: '16px', padding: '20px',
          border: '1px solid #A5D6A7', marginTop: '8px'
        }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1B5E20', fontSize: '16px', marginBottom: '8px' }}>
            <PhoneCall size={20} /> {t.emergency}
          </strong>
          <p style={{ margin: '0 0 8px 0', color: '#388E3C', fontSize: '14px' }}>{t.emergencyText}</p>
          <a href="tel:1962" style={{
            display: 'inline-block', background: '#2E7D32', color: 'white',
            padding: '8px 20px', borderRadius: '20px', fontSize: '16px', fontWeight: '700',
            textDecoration: 'none'
          }}>{t.helpline}</a>
        </div>
      </div>
    </Layout>
  );
}