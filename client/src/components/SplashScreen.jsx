import React, { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

export default function SplashScreen({ message = "Connecting to Secure Server..." }) {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowMessage(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#F8F9FA', position: 'relative', overflow: 'hidden', padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '-10vw', right: '-10vw', width: '40vw', height: '40vw', borderRadius: '50%', border: '1px solid rgba(30,108,69,0.05)' }}></div>
      <div style={{ position: 'absolute', bottom: '-15vw', left: '-10vw', width: '50vw', height: '50vw', borderRadius: '50%', border: '1px solid rgba(30,108,69,0.03)' }}></div>
      
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 1, animation: 'pulse 2s infinite ease-in-out'
      }}>
        <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <Logo size={64} color="#1E6C45" />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1C1E21', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Pashuraksha</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5F6368', fontSize: '0.9rem', fontWeight: '600', marginTop: '16px' }}>
          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #1E6C45', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
          {message}
        </div>
        
        {showSlowMessage && (
          <div style={{ marginTop: '24px', padding: '12px 16px', background: '#FFF8E1', color: '#F57F17', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', maxWidth: '300px', textAlign: 'center', border: '1px solid #FFE082' }}>
            Railway deployment is waking up. This can take up to 20 seconds.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.98); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
