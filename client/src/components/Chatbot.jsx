import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am the PashuSuraksha AI Assistant. How can I help you and your livestock today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let botText = "I understand. Please submit a health report using the Report button so our veterinarians can investigate immediately.";
      const lowerInput = userMsg.text.toLowerCase();
      
      if (lowerInput.includes('fmd') || lowerInput.includes('fever') || lowerInput.includes('blister')) {
        botText = "Symptoms like fever and blisters could indicate Foot and Mouth Disease (FMD). Please isolate the animal and submit an urgent report.";
      } else if (lowerInput.includes('hindi') || lowerInput.includes('namaste')) {
        botText = "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ? कृपया लक्षणों की जानकारी दें।";
      } else if (lowerInput.includes('marathi')) {
        botText = "नमस्कार! मी तुम्हाला कशी मदत करू शकतो? कृपया लक्षणे सांगा.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} color="white" />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} />
              <strong>Pashu AI Assistant</strong>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
