import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Activity, Syringe, Users, PhoneCall } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import './Chatbot.css';

const QUICK_ACTIONS = {
  en: [
    { id: 'fmd', label: 'FMD symptoms', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'Vaccination', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'My herd', icon: <Users size={20} /> },
    { id: 'call', label: 'Call veterinarian', icon: <PhoneCall size={20} /> }
  ],
  hi: [
    { id: 'fmd', label: 'एफएमडी के लक्षण', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'टीकाकरण (Vaccination)', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'मेरे पशु', icon: <Users size={20} /> },
    { id: 'call', label: 'पशु चिकित्सक को बुलाएं', icon: <PhoneCall size={20} /> }
  ],
  mr: [
    { id: 'fmd', label: 'एफएमडी लक्षणे', icon: <Activity size={20} /> },
    { id: 'vaccine', label: 'लसीकरण (Vaccination)', icon: <Syringe size={20} /> },
    { id: 'herd', label: 'माझे प्राणी', icon: <Users size={20} /> },
    { id: 'call', label: 'पशुवैद्याला कॉल करा', icon: <PhoneCall size={20} /> }
  ]
};

const BOT_RESPONSES = {
  en: {
    fmd: "Fever and loss of appetite can have several causes.\nPlease check whether the animal also has difficulty walking, mouth lesions, diarrhea, breathing difficulty or other unusual symptoms.\n\nWHAT YOU CAN DO NOW\nKeep the animal under observation. Contact a veterinarian if symptoms worsen or multiple animals are affected.",
    lumpy: "Skin nodules and fever could indicate Lumpy Skin Disease (LSD). \n\nWHAT YOU CAN DO NOW\nUse insect repellents, isolate the animal, and consult a vet.",
    ppr: "Fever, nasal discharge and diarrhea in goats/sheep could be PPR. \n\nWHAT YOU CAN DO NOW\nHighly contagious - isolate immediately.",
    anthrax: "CRITICAL 🚨 Sudden death with dark blood = suspect Anthrax. \n\nWHAT YOU CAN DO NOW\nDo NOT open the carcass. Burn or bury deep. Call 1962 immediately.",
    vaccine: "For vaccination details and schedules, please check your Vaccine Passbook. The national animal health helpline is 1962 (Toll Free).",
    helpline: "The national animal health helpline is 1962 (Toll Free). Available 24/7 for disease emergencies.",
    default: "I understand your concern. Please submit a health report using the Report button so our veterinarians can investigate. For urgent help, call 1962."
  },
  hi: {
    fmd: "बुखार और भूख न लगना कई बीमारियों के कारण हो सकता है।\nकृपया जांचें कि क्या जानवर को चलने में कठिनाई, मुंह में छाले, या सांस लेने में परेशानी है।\n\nअभी क्या करें:\nजानवर को अलग रखें। अगर लक्षण बिगड़ते हैं तो डॉक्टर से संपर्क करें।",
    lumpy: "त्वचा पर गांठे और बुखार लंपी स्किन डिजीज (LSD) का संकेत हो सकते हैं।\n\nअभी क्या करें:\nमच्छर/मक्खी भगाने वाली दवाओं का प्रयोग करें और पशु को अलग कर दें।",
    ppr: "बकरियों/भेड़ों में बुखार, नाक बहना और दस्त पीपीआर (PPR) हो सकता है।\n\nअभी क्या करें:\nयह बहुत तेजी से फैलता है - तुरंत बीमार पशु को अलग करें।",
    anthrax: "गंभीर 🚨 अचानक मृत्यु और काला खून = एंथ्रेक्स हो सकता है।\n\nअभी क्या करें:\nशव को बिल्कुल न खोलें। इसे जला दें या गहरा गाड़ दें। तुरंत 1962 पर कॉल करें।",
    vaccine: "टीकाकरण की जानकारी के लिए कृपया अपनी वैक्सीन पासबुक देखें। राष्ट्रीय पशु स्वास्थ्य हेल्पलाइन 1962 (टोल-फ्री) है।",
    helpline: "राष्ट्रीय पशु स्वास्थ्य हेल्पलाइन 1962 (टोल-फ्री) है। यह 24/7 उपलब्ध है।",
    default: "मैं आपकी चिंता समझता हूँ। कृपया 'रिपोर्ट' बटन का उपयोग करके स्वास्थ्य रिपोर्ट दर्ज करें ताकि हमारे डॉक्टर इसकी जांच कर सकें। तत्काल सहायता के लिए 1962 पर कॉल करें।"
  },
  mr: {
    fmd: "ताप आणि भूक न लागणे ही अनेक आजारांची लक्षणे असू शकतात.\nप्राण्याला चालताना त्रास होत आहे का, तोंडात फोड आले आहेत का, हे कृपया तपासा.\n\nआता काय करावे:\nप्राण्याला वेगळे ठेवा. लक्षणे वाढल्यास डॉक्टरांशी संपर्क साधा.",
    lumpy: "त्वचेवर गाठी आणि ताप हे लंपी स्किन डिसीज (LSD) असू शकते.\n\nआता काय करावे:\nप्राण्याला वेगळे करा आणि पशुवैद्याचा सल्ला घ्या.",
    ppr: "शेळ्या/मेंढ्यांमध्ये ताप, नाक वाहणे आणि जुलाब हे PPR असू शकते.\n\nआता काय करावे:\nहा आजार वेगाने पसरतो - आजारी प्राण्याला त्वरित वेगळे करा.",
    anthrax: "अत्यंत गंभीर 🚨 काळ्या रक्तासह अचानक मृत्यू = अँथ्रॅक्स असू शकतो.\n\nआता काय करावे:\nमृतदेह उघडू नका. तो जाळून टाका किंवा खोल पुरा. त्वरित 1962 वर कॉल करा.",
    vaccine: "लसीकरणाच्या माहितीसाठी कृपया तुमचे लस पासबुक तपासा. राष्ट्रीय पशु आरोग्य हेल्पलाइन 1962 आहे.",
    helpline: "राष्ट्रीय पशु आरोग्य हेल्पलाइन 1962 (टोल-फ्री) आहे. ती 24/7 उपलब्ध आहे.",
    default: "मला तुमची अडचण समजली. कृपया 'रिपोर्ट' बटण वापरून आरोग्य अहवाल सबमिट करा जेणेकरून आमचे पशुवैद्य तपासणी करू शकतील. तातडीच्या मदतीसाठी 1962 वर कॉल करा."
  }
};

function getBotReply(text, lang) {
  const lower = text.toLowerCase();
  const r = BOT_RESPONSES[lang] || BOT_RESPONSES['en'];
  
  if (lower.includes('fmd') || lower.includes('blister') || lower.includes('बुखार') || lower.includes('छाले') || lower.includes('fever') || lower.includes('ताप') || lower.includes('फोड')) {
    return { text: r.fmd, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VETERINARIAN', primary: false}] };
  }
  if (lower.includes('lumpy') || lower.includes('lsd') || lower.includes('गांठ') || lower.includes('गाठी') || lower.includes('skin')) {
    return { text: r.lumpy, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}] };
  }
  if (lower.includes('ppr') || lower.includes('goat') || lower.includes('sheep') || lower.includes('बकरी') || lower.includes('शेळी') || lower.includes('मेंढी')) {
    return { text: r.ppr, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VETERINARIAN', primary: false}] };
  }
  if (lower.includes('anthrax') || lower.includes('मृत्यु') || lower.includes('रक्त') || lower.includes('खून') || lower.includes('sudden death')) {
    return { text: r.anthrax, actions: [{id: 'call', label: 'CALL 1962 IMMEDIATELY', primary: true}] };
  }
  if (lower.includes('vaccin') || lower.includes('टीका') || lower.includes('लस') || lower.includes('passbook')) {
    return { text: r.vaccine, actions: [{id: 'vaccine_nav', label: 'VACCINE PASSBOOK', primary: true}] };
  }
  if (lower.includes('helpline') || lower.includes('1962') || lower.includes('मदद') || lower.includes('मदत') || lower.includes('call')) {
    return { text: r.helpline, actions: [{id: 'call', label: 'CALL VETERINARIAN', primary: true}] };
  }
  
  return { text: r.default, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL 1962', primary: false}] };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [lang] = useLanguage(); // Sync with global language hook

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = lang === 'hi' ? 'नमस्ते! मैं आपकी पशु स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?' : 
                       (lang === 'mr' ? 'नमस्कार! मी तुमची पशु आरोग्य सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकते?' : 
                       'Hello! I am your Animal Health Assistant. How can I help you today?');
      setMessages([{ id: Date.now(), text: greeting, sender: 'bot' }]);
    }
  }, [isOpen, lang, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  const handleAction = (actionId) => {
    if (actionId === 'herd') { setIsOpen(false); navigate('/farmer/ledger'); return; }
    if (actionId === 'call') { setIsOpen(false); navigate('/farmer/advisory'); return; }
    if (actionId === 'report') { setIsOpen(false); navigate('/farmer/report'); return; }
    if (actionId === 'vaccine_nav') { setIsOpen(false); navigate('/farmer/passbook'); return; }
    
    let userText = 'I need help.';
    if (actionId === 'fmd') userText = lang === 'hi' ? 'मेरी गाय को बुखार है और वह खा नहीं रही है।' : (lang === 'mr' ? 'माझ्या गाईला ताप आहे आणि ती खात नाहीये.' : 'My cow has fever and is not eating.');
    if (actionId === 'vaccine') userText = lang === 'hi' ? 'मुझे टीकाकरण के बारे में जानकारी चाहिए।' : (lang === 'mr' ? 'मला लसीकरणाबद्दल माहिती हवी आहे.' : 'I need information about vaccination.');
    
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
          <span className="chatbot-fab-label">{lang === 'hi' ? 'सहायता' : (lang === 'mr' ? 'मदत' : 'Assistance')}</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <strong style={{ fontSize: '16px', color: '#1B5E20' }}>
                {lang === 'hi' ? 'पशु रक्षा सहायता' : (lang === 'mr' ? 'पशु रक्षा मदत' : 'Pashuraksha Assistance')}
              </strong>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {lang === 'hi' ? 'स्वास्थ्य मार्गदर्शन' : (lang === 'mr' ? 'आरोग्य मार्गदर्शन' : 'Health Guidance')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setIsOpen(false)} className="chatbot-close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
                <div className="chatbot-bubble">{msg.text}</div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="chatbot-actions">
                    {msg.actions.map(act => (
                      <button key={act.id} onClick={() => handleAction(act.id)} className={`chatbot-action-btn ${act.primary ? 'primary' : 'secondary'}`}>
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble typing">
                  <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !typing && (
            <div className="chatbot-quick-actions">
              {(QUICK_ACTIONS[lang] || QUICK_ACTIONS['en']).map(act => (
                <button key={act.id} onClick={() => handleAction(act.id)} className="chatbot-quick-btn">
                  {act.icon} <span>{act.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder={lang === 'hi' ? 'अपनी समस्या यहाँ लिखें...' : (lang === 'mr' ? 'तुमची समस्या येथे लिहा...' : 'Type your problem here...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
