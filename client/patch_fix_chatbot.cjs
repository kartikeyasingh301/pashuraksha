const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Chatbot.jsx');

const newCode = `import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Mic, Activity, Syringe, Users, PhoneCall, AlertTriangle, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import './Chatbot.css';

const QUICK_ACTIONS = {
  en: [
    { id: 'fmd', label: 'FMD symptoms', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'Vaccination', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'My herd', icon: <Users size={20} /> },
    { id: 'call', label: 'Call veterinarian', icon: <PhoneCall size={20} /> }
  ],
  hi: [
    { id: 'fmd', label: 'FMD के लक्षण', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'टीकाकरण', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'मेरा झुंड', icon: <Users size={20} /> },
    { id: 'call', label: 'पशु चिकित्सक को कॉल करें', icon: <PhoneCall size={20} /> }
  ],
  mr: [
    { id: 'fmd', label: 'FMD लक्षणे', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'लसीकरण', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'माझा कळप', icon: <Users size={20} /> },
    { id: 'call', label: 'पशुवैद्याला कॉल करा', icon: <PhoneCall size={20} /> }
  ]
};

const BOT_RESPONSES = {
  en: {
    fmd: "Fever and loss of appetite can have several causes.\\nPlease check whether the animal also has difficulty walking, mouth lesions, diarrhea, breathing difficulty or other unusual symptoms.\\n\\nWHAT YOU CAN DO NOW\\nKeep the animal under observation. Contact a veterinarian if symptoms worsen or multiple animals are affected.",
    lumpy: "Skin nodules and fever could indicate Lumpy Skin Disease (LSD). \\n\\nWHAT YOU CAN DO NOW\\nUse insect repellents, isolate the animal, and consult a vet.",
    ppr: "Fever, nasal discharge and diarrhea in goats/sheep could be PPR. \\n\\nWHAT YOU CAN DO NOW\\nHighly contagious - isolate immediately.",
    anthrax: "CRITICAL ⚠️ Sudden death with dark blood = suspect Anthrax. \\n\\nWHAT YOU CAN DO NOW\\nDo NOT open the carcass. Burn or bury deep. Call 1962 immediately.",
    vaccine: "For vaccination details and schedules, please check your Vaccine Passbook. The national animal health helpline is 1962 (Toll Free).",
    helpline: "The national animal health helpline is 1962 (Toll Free). Available 24/7 for disease emergencies.",
    default: "I understand your concern. Please submit a health report using the Report button so our veterinarians can investigate. For urgent help, call 1962."
  },
  hi: {
    fmd: "बुखार और भूख न लगना कई कारणों से हो सकता है।\\nकृपया जांचें कि क्या जानवर को चलने में कठिनाई, मुंह में घाव, दस्त आदि हैं।\\n\\nआप अभी क्या कर सकते हैं\\nजानवर को निगरानी में रखें। लक्षण बिगड़ने पर पशु चिकित्सक से संपर्क करें।",
    lumpy: "त्वचा पर गांठें और बुखार लंपी त्वचा रोग (LSD) का संकेत हो सकते हैं। \\n\\nआप अभी क्या कर सकते हैं\\nकीट विकर्षक का उपयोग करें, जानवर को अलग करें।",
    ppr: "बकरी/भेड़ में बुखार, नाक से स्राव और दस्त पीपीआर हो सकता है। \\n\\nआप अभी क्या कर सकते हैं\\nअत्यधिक संक्रामक - तुरंत अलग करें।",
    anthrax: "गंभीर ⚠️ गहरे खून के साथ अचानक मौत = एंथ्रेक्स का संदेह। \\n\\nआप अभी क्या कर सकते हैं\\nशव को न खोलें। गहराई में दफनाएं। तुरंत 1962 पर कॉल करें।",
    vaccine: "टीकाकरण विवरण और कार्यक्रम के लिए, कृपया अपनी वैक्सीन पासबुक देखें।",
    helpline: "राष्ट्रीय पशु स्वास्थ्य हेल्पलाइन 1962 (टोल फ्री) है।",
    default: "मैं आपकी चिंता समझता हूं। कृपया एक स्वास्थ्य रिपोर्ट प्रस्तुत करें ताकि हमारे पशु चिकित्सक जांच कर सकें।"
  },
  mr: {
    fmd: "ताप आणि भूक न लागण्याची अनेक कारणे असू शकतात.\\nकृपया प्राण्याला चालण्यास त्रास, तोंडात फोड, जुलाब इ. आहेत का ते तपासा.\\n\\nतुम्ही आता काय करू शकता\\nप्राण्याला निरीक्षणाखाली ठेवा. लक्षणे वाढल्यास पशुवैद्याशी संपर्क साधा.",
    lumpy: "त्वचेवर गाठी आणि ताप हे लंपी त्वचा रोग (LSD) दर्शवू शकतात. \\n\\nतुम्ही आता काय करू शकता\\nकीटकनाशकांचा वापर करा, प्राण्याला वेगळे करा.",
    ppr: "शेळ्या/मेंढ्यांमध्ये ताप, नाकातून स्त्राव आणि जुलाब हे पीपीआर असू शकते. \\n\\nतुम्ही आता काय करू शकता\\nअत्यंत संसर्गजन्य - त्वरित वेगळे करा.",
    anthrax: "गंभीर ⚠️ गडद रक्तासह अचानक मृत्यू = अँथ्रॅक्सचा संशय. \\n\\nतुम्ही आता काय करू शकता\\nमृतदेह उघडू नका. खोल पुराव. त्वरित 1962 वर कॉल करा.",
    vaccine: "लसीकरण तपशील आणि वेळापत्रकासाठी, कृपया तुमचे लस पासबुक तपासा.",
    helpline: "राष्ट्रीय पशु आरोग्य हेल्पलाइन 1962 (टोल फ्री) आहे.",
    default: "मला तुमची चिंता समजते. कृपया आरोग्य अहवाल सबमिट करा जेणेकरून आमचे पशुवैद्य तपास करू शकतील."
  }
};

function getBotReply(text, lang) {
  const lower = text.toLowerCase();
  const r = BOT_RESPONSES[lang];
  
  if (lower.includes('fmd') || lower.includes('blister') || lower.includes('छाले') || lower.includes('फोड') || lower.includes('fever')) {
    return { text: r.fmd, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VETERINARIAN', primary: false}] };
  }
  if (lower.includes('lumpy') || lower.includes('lsd') || lower.includes('गांठ') || lower.includes('गाठी')) {
    return { text: r.lumpy, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}] };
  }
  if (lower.includes('ppr') || lower.includes('goat') || lower.includes('sheep') || lower.includes('बकरी') || lower.includes('शेळी')) {
    return { text: r.ppr, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VETERINARIAN', primary: false}] };
  }
  if (lower.includes('anthrax') || lower.includes('एंथ्रेक्स') || lower.includes('अँथ्रॅक्स') || lower.includes('sudden death')) {
    return { text: r.anthrax, actions: [{id: 'call', label: 'CALL 1962 IMMEDIATELY', primary: true}] };
  }
  if (lower.includes('vaccin') || lower.includes('टीका') || lower.includes('लस') || lower.includes('passbook')) {
    return { text: r.vaccine, actions: [{id: 'vaccine_nav', label: 'VACCINE PASSBOOK', primary: true}] };
  }
  if (lower.includes('helpline') || lower.includes('1962') || lower.includes('हेल्पलाइन') || lower.includes('call')) {
    return { text: r.helpline, actions: [{id: 'call', label: 'CALL VETERINARIAN', primary: true}] };
  }
  return { text: r.default, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VETERINARIAN', primary: false}] };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleAction = (actionId) => {
    if (actionId === 'herd') { setIsOpen(false); navigate('/farmer/ledger'); return; }
    if (actionId === 'call') { setIsOpen(false); navigate('/farmer/advisory'); return; }
    if (actionId === 'report') { setIsOpen(false); navigate('/farmer/report'); return; }
    if (actionId === 'vaccine_nav') { setIsOpen(false); navigate('/farmer/passbook'); return; }
    
    let userText = 'I need help.';
    if (actionId === 'fmd') userText = lang === 'en' ? 'My cow has fever and is not eating.' : (lang === 'hi' ? 'मेरी गाय को बुखार है' : 'माझ्या गाईला ताप आहे');
    if (actionId === 'vaccine') userText = lang === 'en' ? 'I need information about vaccination.' : (lang === 'hi' ? 'मुझे टीकाकरण की जानकारी चाहिए' : 'मला लसीकरणाची माहिती हवी आहे');
    
    simulateUserMessage(userText);
  };

  const simulateUserMessage = (text) => {
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(userMsg.text, lang);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply.text, actions: reply.actions, sender: 'bot' }]);
      setTyping(false);
    }, 900);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    simulateUserMessage(input.trim());
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={20} />
          <span className="chatbot-fab-label">Pashuraksha Assistance</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <strong style={{ fontSize: '16px', color: '#1B5E20' }}>Pashuraksha Assistance</strong>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Health Guidance</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid #ddd', color: '#333', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', outline: 'none' }}>
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="mr">MR</option>
              </select>
              <button onClick={() => setIsOpen(false)} className="chatbot-close">
                <X size={20} />
              </button>
            </div>
          </div>

          {messages.length === 0 && !typing ? (
            <div className="chat-initial-state">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ background: '#E8F5E9', width: '56px', height: '56px', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <MessageSquare size={28} color="#2E7D32" />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1B5E20' }}>HOW CAN WE HELP?</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Ask about your animals, vaccination or reporting.</p>
              </div>

              <div>
                {QUICK_ACTIONS[lang].map(action => (
                  <div key={action.id} className="chat-quick-action" onClick={() => handleAction(action.id)}>
                    <div className="qa-icon">{action.icon}</div>
                    <div className="qa-text" style={{ flex: 1 }}>{action.label}</div>
                    <ChevronRight size={18} color="#aaa" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="chatbot-messages">
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={\`chat-bubble \${msg.sender}\`} style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                  {msg.actions && (
                    <div className="bot-actions-container">
                      {msg.actions.map(act => (
                        <button key={act.id} className={\`bot-action-btn \${act.primary ? 'primary' : ''}\`} onClick={() => handleAction(act.id)}>
                          {act.id === 'report' ? <FileText size={16}/> : <PhoneCall size={16}/>}
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', color: '#666', fontSize: '13px', padding: '12px' }}>
                  <div className="dot-typing"></div>
                  Preparing guidance...
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          <div className="chatbot-input">
            <button className="chat-mic-btn" title="Speak">
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Ask about your animal..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync(file, newCode, 'utf8');
console.log('Chatbot thoroughly fixed.');
