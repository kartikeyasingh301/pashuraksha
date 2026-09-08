import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { Shield, Target, AlertTriangle, Skull, Activity, PhoneCall, Languages, Video } from 'lucide-react';

const ADVISORIES = {
  en: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'FMD Prevention',
      severity: 'high',
      content: 'Foot-and-Mouth Disease (FMD) spreads rapidly. Vaccinate all cattle and buffalo every 6 months. Report any animals showing blisters or lameness immediately.',
      tags: ['Cattle', 'Buffalo', 'Vaccination'],
      videoId: 'R6Qk0-V-zE4' // Dummy educational video ID
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'Lumpy Skin Disease - Early Warning',
      severity: 'medium',
      content: 'LSD affects cattle with skin nodules and fever. It spreads through insects. Use insect repellents and mosquito nets. Report lumps immediately.',
      tags: ['Cattle', 'Monsoon'],
      videoId: 'J7A3-x1K1Uo' // Dummy video ID
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'Anthrax Emergency Protocol',
      severity: 'critical',
      content: 'CRITICAL: Anthrax causes sudden death. DO NOT open carcasses. Bury deep or burn. Alert veterinary dept immediately. Human health risk!',
      tags: ['Zoonotic', 'Emergency'],
      videoId: ''
    }
  ],
  hi: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'खुरपका-मुँहपका (FMD) की रोकथाम',
      severity: 'high',
      content: 'खुरपका-मुँहपका रोग तेजी से फैलता है। हर 6 महीने में सभी मवेशियों का टीकाकरण करें। यदि छाले या लंगड़ापन दिखे तो तुरंत रिपोर्ट करें।',
      tags: ['मवेशी', 'भैंस', 'टीकाकरण'],
      videoId: 'R6Qk0-V-zE4'
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'लंपी त्वचा रोग - प्रारंभिक चेतावनी',
      severity: 'medium',
      content: 'लंपी रोग (LSD) त्वचा पर गांठ और बुखार का कारण बनता है। यह कीड़ों से फैलता है। तुरंत रिपोर्ट करें।',
      tags: ['मवेशी', 'मानसून'],
      videoId: 'J7A3-x1K1Uo'
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'एंथ्रेक्स आपातकालीन प्रोटोकॉल',
      severity: 'critical',
      content: 'चेतावनी: एंथ्रेक्स अचानक मौत का कारण बनता है। मृत जानवरों को न खोलें। गहराई में दफनाएं या जला दें। तुरंत डॉक्टर को बुलाएं!',
      tags: ['ज़ूनोटिक', 'आपातकालीन'],
      videoId: ''
    }
  ],
  mr: [
    {
      id: 1,
      icon: <Target size={24} color="#1565C0" />,
      title: 'लाळ्या-खुरकूत (FMD) प्रतिबंध',
      severity: 'high',
      content: 'लाळ्या-खुरकूत रोग वेगाने पसरतो. दर 6 महिन्यांनी सर्व गुरांचे आणि म्हशींचे लसीकरण करा. फोड किंवा लंगडेपणा दिसल्यास त्वरित कळवा.',
      tags: ['गुरे', 'म्हैस', 'लसीकरण'],
      videoId: 'R6Qk0-V-zE4'
    },
    {
      id: 2,
      icon: <Activity size={24} color="#0277BD" />,
      title: 'लंपी त्वचा रोग - पूर्वसूचना',
      severity: 'medium',
      content: 'लंपी त्वचा रोग (LSD) मुळे त्वचेवर गाठी येतात आणि ताप येतो. तो कीटकांद्वारे पसरतो. गाठी दिसल्यास त्वरित कळवा.',
      tags: ['गुरे', 'पावसाळा'],
      videoId: 'J7A3-x1K1Uo'
    },
    {
      id: 3,
      icon: <Skull size={24} color="#C62828" />,
      title: 'अँथ्रॅक्स आपत्कालीन प्रोटोकॉल',
      severity: 'critical',
      content: 'धोका: अँथ्रॅक्स मुळे अचानक मृत्यू होतो. मृत जनावरे कापू नका. खोल पुरा किंवा जाळा. त्वरित डॉक्टरांना बोलवा!',
      tags: ['झुनोटिक', 'आपत्कालीन'],
      videoId: ''
    }
  ]
};

const SEVERITY_COLORS = {
  critical: '#C62828',
  high: '#E65100',
  medium: '#F57F17',
  low: '#2E7D32',
};

const LABELS = {
  en: {
    title: "Health Advisories",
    intro: "Important disease prevention guidelines and alerts for livestock farmers.",
    emergency: "Emergency Contact",
    emergencyText: "If you suspect a disease outbreak, contact your nearest Veterinary Dispensary immediately."
  },
  hi: {
    title: "स्वास्थ्य सलाह",
    intro: "पशुपालकों के लिए महत्वपूर्ण रोग निवारण दिशानिर्देश और अलर्ट।",
    emergency: "आपातकालीन संपर्क",
    emergencyText: "यदि आपको किसी बीमारी के फैलने का संदेह है, तो तुरंत अपने नजदीकी पशु चिकित्सालय से संपर्क करें।"
  },
  mr: {
    title: "आरोग्य सल्ला",
    intro: "पशुपालकांसाठी महत्त्वपूर्ण रोग प्रतिबंधक मार्गदर्शक तत्त्वे आणि इशारे.",
    emergency: "आपत्कालीन संपर्क",
    emergencyText: "रोगाची साथ पसरल्याचा संशय असल्यास, त्वरित जवळच्या पशुवैद्यकीय दवाखान्याशी संपर्क साधा."
  }
};

export default function Advisory() {
  const [lang, setLang] = useState('en');
  const t = LABELS[lang];
  const list = ADVISORIES[lang];

  return (
    <Layout title={t.title}>
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '6px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Languages size={18} color="#2E7D32" style={{ marginRight: '8px' }} />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', fontWeight: 'bold', color: '#2E7D32' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>

        <div className="advisory-header" style={{ marginBottom: '20px' }}>
          <p className="advisory-intro" style={{ fontSize: '16px', color: '#555' }}>{t.intro}</p>
        </div>

        <div className="advisory-list">
          {list.map((adv) => (
            <div
              key={adv.id}
              className="advisory-card card"
              style={{ borderLeft: '5px solid ' + SEVERITY_COLORS[adv.severity], marginBottom: '20px', padding: '16px', borderRadius: '12px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
            >
              <div className="advisory-card-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <span className="advisory-icon" style={{ marginTop: '2px' }}>{adv.icon}</span>
                <div className="advisory-card-title-group" style={{ flex: 1 }}>
                  <h3 className="advisory-card-title" style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#333' }}>{adv.title}</h3>
                  <span className="advisory-severity" style={{ color: SEVERITY_COLORS[adv.severity], fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', background: SEVERITY_COLORS[adv.severity] + '1A', padding: '2px 8px', borderRadius: '12px' }}>
                    {adv.severity}
                  </span>
                </div>
              </div>
              
              {adv.videoId && (
                <div style={{ margin: '12px 0', borderRadius: '8px', overflow: 'hidden', background: '#000', position: 'relative', paddingTop: '56.25%' }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`https://www.youtube.com/embed/${adv.videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <p className="advisory-content" style={{ fontSize: '15px', lineHeight: '1.5', color: '#444', marginBottom: '16px' }}>{adv.content}</p>
              
              <div className="advisory-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {adv.tags.map((tag) => (
                  <span key={tag} className="advisory-tag" style={{ background: '#f0f0f0', color: '#666', padding: '4px 10px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="advisory-footer card" style={{ padding: '20px', borderRadius: '12px', background: '#E8F5E9', border: '1px solid #C8E6C9', marginTop: '24px' }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2E7D32', fontSize: '18px', marginBottom: '8px' }}>
            <PhoneCall size={20} /> {t.emergency}
          </strong>
          <p style={{ margin: 0, color: '#388E3C', fontSize: '15px' }}>{t.emergencyText}</p>
        </div>
      </div>
    </Layout>
  );
}