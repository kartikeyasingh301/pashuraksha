import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Mic, Activity, Syringe, Users, PhoneCall, AlertTriangle, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import './Chatbot.css';

const QUICK_ACTIONS = [
  { id: 'fmd', label: 'FMD symptoms', icon: <Activity size={20} /> },
  { id: 'vaccine', label: 'Vaccination', icon: <Syringe size={20} /> },
  { id: 'herd', label: 'My herd', icon: <Users size={20} /> },
  { id: 'call', label: 'Call veterinarian', icon: <PhoneCall size={20} /> }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleAction = (actionId) => {
    if (actionId === 'herd') {
      setIsOpen(false);
      navigate('/farmer/ledger');
      return;
    }
    if (actionId === 'call') {
      setIsOpen(false);
      navigate('/farmer/advisory');
      return;
    }
    if (actionId === 'report') {
      setIsOpen(false);
      navigate('/farmer/report');
      return;
    }
    
    // For FMD and Vaccine, simulate chat flow
    const text = actionId === 'fmd' ? 'My cow has fever and is not eating.' : 'I need information about vaccination.';
    simulateUserMessage(text, actionId);
  };

  const simulateUserMessage = (text, actionId) => {
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    
    setTimeout(() => {
      let replyText = '';
      let replyActions = [];
      
      if (actionId === 'fmd' || text.toLowerCase().includes('fever')) {
        replyText = "Fever and loss of appetite can have several causes.\nPlease check whether the animal also has difficulty walking, mouth lesions, diarrhea, breathing difficulty or other unusual symptoms.\n\nWHAT YOU CAN DO NOW\nKeep the animal under observation. Contact a veterinarian if symptoms worsen or multiple animals are affected.";
        replyActions = [
          { id: 'report', label: 'REPORT HEALTH ISSUE', primary: true },
          { id: 'call', label: 'CALL VETERINARIAN', primary: false }
        ];
      } else {
        replyText = "For vaccination details and schedules, please check your Vaccine Passbook. The national animal health helpline is 1962 (Toll Free).";
        replyActions = [
          { id: 'vaccine_nav', label: 'VACCINE PASSBOOK', primary: true },
          { id: 'call', label: 'CALL VETERINARIAN', primary: false }
        ];
      }
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: replyText, 
        sender: 'bot',
        actions: replyActions
      }]);
      setTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    simulateUserMessage(text, 'generic');
  };

  const handleInlineAction = (actionId) => {
    if (actionId === 'vaccine_nav') {
      setIsOpen(false);
      navigate('/farmer/passbook');
    } else {
      handleAction(actionId);
    }
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
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              <X size={20} />
            </button>
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

              {/* Context Area */}
              <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>My Herd</div>
                  <div style={{ color: '#333', fontSize: '13px', fontWeight: '700' }}>27 animals</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Current Attention</div>
                  <div style={{ color: '#D32F2F', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14}/> 1 active case</div>
                </div>
              </div>

              <div>
                {QUICK_ACTIONS.map(action => (
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
                  <div className={`chat-bubble ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                  {msg.actions && (
                    <div className="bot-actions-container">
                      {msg.actions.map(act => (
                        <button key={act.id} className={`bot-action-btn ${act.primary ? 'primary' : ''}`} onClick={() => handleInlineAction(act.id)}>
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
