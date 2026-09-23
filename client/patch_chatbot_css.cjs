const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Chatbot.css');

const css = `.chatbot-fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--brand-600);
  border: 1px solid var(--brand-700);
  color: white;
  padding: 12px 18px;
  border-radius: 28px;
  box-shadow: 0 4px 16px rgba(46,125,50,0.3);
  cursor: pointer;
  z-index: 9999;
  font-weight: 700;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.chatbot-fab:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(46,125,50,0.4);
}
.chatbot-fab-label { color: white; }

.chatbot-window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 65px; /* Above bottom nav */
  background: #fcfcfc;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (min-width: 1024px) {
  .chatbot-window {
    top: 0;
    bottom: 0;
    left: auto;
    right: 0;
    width: 400px;
    border-radius: 0;
    border-left: 1px solid #e0e0e0;
    box-shadow: -4px 0 24px rgba(0,0,0,0.08);
    animation: slideLeft 0.3s ease-out forwards;
  }
  @keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
}

.chatbot-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.chatbot-close {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  transition: background 0.2s;
}
.chatbot-close:hover { background: #f0f0f0; }

.chatbot-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}
.chat-bubble.bot {
  align-self: flex-start;
  background: white;
  color: #333;
  border: 1px solid #eee;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.chat-bubble.user {
  align-self: flex-end;
  background: #E8F5E9;
  color: #1B5E20;
  border: 1px solid #C8E6C9;
  border-bottom-right-radius: 4px;
}

.bot-actions-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.bot-action-btn {
  background: white;
  border: 1px solid #d0d0d0;
  color: #333;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s, border-color 0.2s;
}
.bot-action-btn:hover {
  background: #f9f9f9;
  border-color: #bbb;
}
.bot-action-btn.primary {
  background: var(--brand-50);
  border-color: var(--brand-300);
  color: var(--brand-700);
}
.bot-action-btn.primary:hover {
  background: var(--brand-100);
}

.chatbot-input {
  display: flex;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #eee;
  gap: 12px;
  align-items: center;
}
.chatbot-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}
.chatbot-input input:focus { border-color: var(--brand-600); }
.chat-mic-btn {
  background: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.chat-mic-btn:hover { background: #e0e0e0; }
.chat-send-btn {
  background: var(--brand-600);
  color: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.chat-send-btn:hover { background: var(--brand-700); }

.chat-initial-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  background: #fcfcfc;
  overflow-y: auto;
}

.chat-quick-action {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.1s, box-shadow 0.1s;
}
.chat-quick-action:active {
  transform: scale(0.98);
}
.chat-quick-action:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #d0d0d0;
}
.chat-quick-action .qa-icon {
  background: #f0f7f0;
  color: var(--brand-700);
  padding: 10px;
  border-radius: 10px;
  display: flex;
}
.chat-quick-action .qa-text {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}
`;
fs.writeFileSync(file, css, 'utf8');
console.log('Chatbot.css rewritten');
