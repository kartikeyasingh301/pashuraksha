import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Activity, Syringe, Users, PhoneCall, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { apiPost } from '../api/client.js';
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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [lang] = useLanguage();

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // We do not auto-send so they can review the text first.
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        // Set language based on app state
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN');
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert(lang === 'hi' ? 'आपका ब्राउज़र वॉयस टाइपिंग का समर्थन नहीं करता है।' : 
              lang === 'mr' ? 'तुमचा ब्राउझर व्हॉइस टायपिंगला समर्थन देत नाही.' : 
              'Your browser does not support voice typing.');
      }
    }
  };

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

  const simulateUserMessage = async (text) => {
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    
    try {
      const reply = await apiPost('/chat', { message: text, lang });
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply.text, actions: reply.actions || [], sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = lang === 'hi' ? 'क्षमा करें, मुझे सर्वर से जुड़ने में समस्या आ रही है। कृपया बाद में प्रयास करें।' : 
                      (lang === 'mr' ? 'क्षमस्व, मला सर्व्हरशी कनेक्ट करण्यात समस्या येत आहे. कृपया नंतर प्रयत्न करा.' : 
                      'Sorry, I am having trouble connecting to the server. Please try again later.');
      setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMsg, actions: [], sender: 'bot' }]);
    } finally {
      setTyping(false);
    }
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
                    {msg.actions.map((act, index) => (
                      <button key={index} onClick={() => handleAction(act.id)} className={`chatbot-action-btn ${act.primary ? 'primary' : 'secondary'}`}>
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
            <button 
              onClick={toggleListen} 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              title={lang === 'hi' ? 'बोलकर टाइप करें' : lang === 'mr' ? 'बोलून टाइप करा' : 'Voice Typing'}
              style={{
                background: isListening ? '#ffebee' : '#f5f5f5',
                color: isListening ? '#d32f2f' : '#666',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isListening ? <MicOff size={20} className="pulse-anim" /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              placeholder={
                isListening 
                  ? (lang === 'hi' ? 'सुन रहा हूँ...' : lang === 'mr' ? 'ऐकत आहे...' : 'Listening...')
                  : (lang === 'hi' ? 'अपनी समस्या यहाँ लिखें...' : lang === 'mr' ? 'तुमची समस्या येथे लिहा...' : 'Type your problem here...')
              }
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
      <style dangerouslySetInnerHTML={{__html: `
        .pulse-anim { animation: pulse-red 1.5s infinite; }
        @keyframes pulse-red {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </>
  );
}
