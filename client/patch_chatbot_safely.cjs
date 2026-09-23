const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Chatbot.jsx');
let code = fs.readFileSync(file, 'utf8');

// We need to add the new imports
code = code.replace(
  /import \{ MessageSquare, X, Send, Languages \} from 'lucide-react';/,
  "import { MessageSquare, X, Send, Languages, Mic, Activity, Syringe, Users, PhoneCall, ChevronRight, FileText } from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';"
);

// Add QUICK_ACTIONS
const quickActions = `
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
`;

code = code.replace(/const BOT_RESPONSES = \{/, quickActions + '\nconst BOT_RESPONSES = {');

// We need to update getBotReply to return actions
code = code.replace(
  /return r\.fmd;/,
  "return { text: r.fmd, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VET', primary: false}] };"
);
code = code.replace(
  /return r\.lumpy;/,
  "return { text: r.lumpy, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}] };"
);
code = code.replace(
  /return r\.ppr;/,
  "return { text: r.ppr, actions: [{id: 'report', label: 'REPORT HEALTH ISSUE', primary: true}, {id: 'call', label: 'CALL VET', primary: false}] };"
);
code = code.replace(
  /return r\.anthrax;/,
  "return { text: r.anthrax, actions: [{id: 'call', label: 'CALL 1962 IMMEDIATELY', primary: true}] };"
);
code = code.replace(
  /return r\.vaccine;/,
  "return { text: r.vaccine, actions: [{id: 'vaccine_nav', label: 'VACCINE PASSBOOK', primary: true}] };"
);
code = code.replace(
  /return r\.helpline;/,
  "return { text: r.helpline, actions: [{id: 'call', label: 'CALL 1962', primary: true}] };"
);
code = code.replace(
  /return r\.default;/,
  "return { text: r.default, actions: [{id: 'report', label: 'REPORT ISSUE', primary: true}, {id: 'call', label: 'CALL VET', primary: false}] };"
);

// Now update the component itself
// We need to remove the initial greeting useEffect so it starts empty.
code = code.replace(
  /useEffect\(\(\) => \{\s*setMessages\(\[\{ id: 1, text: BOT_RESPONSES\[lang\]\.greeting, sender: 'bot' \}\]\);\s*\}, \[lang\]\);/,
  "// No initial greeting so we show the beautiful empty state"
);

// We need to add useNavigate
code = code.replace(
  /const \[typing, setTyping\] = useState\(false\);/,
  "const [typing, setTyping] = useState(false);\n  const navigate = useNavigate();"
);

// Replace handleSend
const newHandleSend = `
  const handleAction = (actionId) => {
    if (actionId === 'herd') { setIsOpen(false); navigate('/farmer/ledger'); return; }
    if (actionId === 'call') { setIsOpen(false); navigate('/farmer/advisory'); return; }
    if (actionId === 'report') { setIsOpen(false); navigate('/farmer/report'); return; }
    if (actionId === 'vaccine_nav') { setIsOpen(false); navigate('/farmer/passbook'); return; }
    
    const userText = actionId === 'fmd' ? 'I suspect FMD symptoms.' : 'Vaccination details please.';
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
`;
code = code.replace(
  /const handleSend = \(\) => \{[\s\S]*?\}, 900\);\n  \};/,
  newHandleSend
);

// We need to completely rewrite the return block to use the new UI but keep the language switcher.
const renderBlock = `  return (
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
                style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid #ddd', color: '#333', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
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
}`;

code = code.replace(/return \([\s\S]*?\);\s*\}/, renderBlock + '\n}');

fs.writeFileSync(file, code, 'utf8');
console.log('Safely merged logic and UI');
