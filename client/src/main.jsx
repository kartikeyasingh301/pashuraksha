import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    const ok = confirm('A new version of PashuSuraksha is available. Update now?');
    if (ok) window.location.reload();
  },
  onOfflineReady() {
    console.log('PashuSuraksha is ready to work offline.');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
