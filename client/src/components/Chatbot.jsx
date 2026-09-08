import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Languages } from 'lucide-react';
import './Chatbot.css';

const BOT_RESPONSES = {
  en: {
    greeting: "Hello! I'm your PashuSuraksha AI Assistant. Ask me about livestock diseases, symptoms, or vaccination schedules.",
    fmd: "Symptoms like blisters and excessive salivation suggest Foot and Mouth Disease (FMD). 🔴 Isolate the animal immediately. Vaccinate every 6 months. Submit a report now.",
    lumpy: "Skin nodules and fever could indicate Lumpy Skin Disease (LSD). 🟠 Use insect repellents, apply LSD vaccine, and consult a vet. Submit a report.",
    ppr: "Fever, nasal discharge and diarrhea in goats/sheep could be PPR. 🔴 Highly contagious — isolate immediately and call your vet.",
    anthrax: "CRITICAL ⛔ Sudden death with dark blood = suspect Anthrax. Do NOT open the carcass. Burn or bury deep. Call 1962 immediately.",
    vaccine: "Key vaccinations for your livestock:\n• FMD — every 6 months\n• PPR — annually (goats/sheep)\n• BQ/HS — annually (cattle)\n• Anthrax — annually in endemic areas\n\nCall 1962 for free vaccination!",
    helpline: "The national animal health helpline is 1962 (Toll Free). Available 24/7 for disease emergencies.",
    default: "I understand your concern. Please submit a health report using the Report button so our veterinarians can investigate. For urgent help, call 1962.",
  },
  hi: {
    greeting: "नमस्ते! मैं आपका PashuSuraksha AI सहायक हूँ। पशु रोग, लक्षण या टीकाकरण के बारे में पूछें।",
    fmd: "छाले और अत्यधिक लार खुरपका-मुँहपका (FMD) का संकेत हो सकता है। 🔴 पशु को तुरंत अलग करें। हर 6 महीने में टीका लगाएं। अभी रिपोर्ट दर्ज करें।",
    lumpy: "त्वचा पर गांठ और बुखार लंपी रोग (LSD) हो सकता है। 🟠 कीट विकर्षक लगाएं, LSD टीका लगाएं और पशु चिकित्सक से संपर्क करें।",
    ppr: "बकरी/भेड़ में बुखार, नाक से पानी और दस्त PPR हो सकता है। 🔴 बहुत संक्रामक है — तुरंत अलग करें और पशु डॉक्टर को बुलाएं।",
    anthrax: "खतरा ⛔ अचानक मौत और गहरे रंग का खून = एंथ्रेक्स का संदेह। शव को न खोलें। जलाएं या गहरे दफनाएं। तुरंत 1962 पर कॉल करें।",
    vaccine: "आपके पशुओं के लिए जरूरी टीके:\n• FMD — हर 6 महीने\n• PPR — सालाना (बकरी/भेड़)\n• BQ/HS — सालाना (मवेशी)\n• एंथ्रेक्स — प्रभावित क्षेत्रों में सालाना\n\nमुफ्त टीके के लिए 1962 पर कॉल करें!",
    helpline: "राष्ट्रीय पशु स्वास्थ्य हेल्पलाइन: 1962 (टोल फ्री)। 24/7 उपलब्ध।",
    default: "मैं समझ गया। कृपया रिपोर्ट बटन से स्वास्थ्य रिपोर्ट दर्ज करें ताकि हमारे पशु चिकित्सक जांच कर सकें। आपातकाल में 1962 पर कॉल करें।",
  },
  mr: {
    greeting: "नमस्कार! मी तुमचा PashuSuraksha AI सहायक आहे. पशु रोग, लक्षणे किंवा लसीकरणाबद्दल विचारा.",
    fmd: "फोड आणि जास्त लाळ हे लाळ्या-खुरकूत (FMD) चे लक्षण असू शकते. 🔴 प्राण्याला लगेच वेगळे करा. दर 6 महिन्यांनी लस द्या. आत्ताच अहवाल सबमिट करा.",
    lumpy: "त्वचेवर गाठी आणि ताप हे लंपी रोग (LSD) असू शकते. 🟠 कीटकनाशके वापरा, LSD लस द्या आणि पशुवैद्यांशी संपर्क करा.",
    ppr: "शेळी/मेंढ्यांमध्ये ताप, नाकातून पाणी आणि जुलाब PPR असू शकते. 🔴 अत्यंत संसर्गजन्य — लगेच वेगळे करा आणि पशुवैद्यांना बोलवा.",
    anthrax: "धोका ⛔ अचानक मृत्यू आणि काळे रक्त = अँथ्रॅक्सचा संशय. शव उघडू नका. जाळा किंवा खोल पुरा. लगेच 1962 वर कॉल करा.",
    vaccine: "तुमच्या पशुधनासाठी महत्त्वाच्या लसी:\n• FMD — दर 6 महिने\n• PPR — वार्षिक (शेळी/मेंढ्या)\n• BQ/HS — वार्षिक (गुरे)\n• अँथ्रॅक्स — प्रभावित भागात वार्षिक\n\nमोफत लसीसाठी 1962 वर कॉल करा!",
    helpline: "राष्ट्रीय पशु आरोग्य हेल्पलाइन: 1962 (टोल फ्री). 24/7 उपलब्ध.",
    default: "मी समजलो. कृपया रिपोर्ट बटनाने आरोग्य अहवाल सबमिट करा जेणेकरून आमचे पशुवैद्य तपासणी करू शकतात. आपत्कालीन परिस्थितीत 1962 वर कॉल करा.",
  },
};

function getBotReply(text, lang) {
  const lower = text.toLowerCase();
  const r = BOT_RESPONSES[lang];
  if (lower.includes('fmd') || lower.includes('blister') || lower.includes('खुरपका') || lower.includes('लाळ्या') || lower.includes('salivation') || lower.includes('लार') || lower.includes('लाळ')) return r.fmd;
  if (lower.includes('lumpy') || lower.includes('lsd') || lower.includes('लंपी') || lower.includes('गांठ') || lower.includes('गाठ') || lower.includes('nodule')) return r.lumpy;
  if (lower.includes('ppr') || lower.includes('goat') || lower.includes('sheep') || lower.includes('बकरी') || lower.includes('शेळी') || lower.includes('मेंढ')) return r.ppr;
  if (lower.includes('anthrax') || lower.includes('एंथ्रेक्स') || lower.includes('अँथ्रॅक्स') || lower.includes('sudden death') || lower.includes('अचानक')) return r.anthrax;
  if (lower.includes('vaccin') || lower.includes('टीका') || lower.includes('लस') || lower.includes('टीकाकरण') || lower.includes('लसीकरण')) return r.vaccine;
  if (lower.includes('helpline') || lower.includes('1962') || lower.includes('हेल्पलाइन') || lower.includes('call') || lower.includes('contact')) return r.helpline;
  return r.default;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // Reset messages when language changes
  useEffect(() => {
    setMessages([{ id: 1, text: BOT_RESPONSES[lang].greeting, sender: 'bot' }]);
  }, [lang]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(userMsg.text, lang);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
      setTyping(false);
    }, 900);
  };

  const QUICK_QUESTIONS = {
    en: ['FMD symptoms?', 'Vaccination schedule', 'Call helpline'],
    hi: ['FMD के लक्षण?', 'टीकाकरण कार्यक्रम', 'हेल्पलाइन'],
    mr: ['FMD लक्षणे?', 'लसीकरण वेळापत्रक', 'हेल्पलाइन'],
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} color="white" />
          <span className="chatbot-fab-label">AI Help</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '15px' }}>Pashu AI</strong>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Online · Disease Assistant</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                <option value="en" style={{ color: '#000' }}>EN</option>
                <option value="hi" style={{ color: '#000' }}>हि</option>
                <option value="mr" style={{ color: '#000' }}>म</option>
              </select>
              <button onClick={() => setIsOpen(false)} className="chatbot-close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '10px 14px' }}>
                <span className="dot-typing" /><span className="dot-typing" style={{ animationDelay: '0.2s' }} /><span className="dot-typing" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Question Chips */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#f9f9f9', borderTop: '1px solid #eee' }}>
            {QUICK_QUESTIONS[lang].map((q) => (
              <button key={q} onClick={() => { setInput(q); setTimeout(handleSend, 50); }}
                style={{ background: '#e8f5e9', color: '#2E7D32', border: 'none', borderRadius: '14px', padding: '5px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'en' ? 'Ask about your animals...' : lang === 'hi' ? 'पशुओं के बारे में पूछें...' : 'प्राण्यांबद्दल विचारा...'}
            />
            <button onClick={handleSend} className="chat-send-btn">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
