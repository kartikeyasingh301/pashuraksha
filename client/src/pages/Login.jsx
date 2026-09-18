import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Invalid username or password.');
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLongLoading(true), 4000);
    setError('');
    try {
      const user = await login(username.trim(), password);
      navigate(user.role === 'vet' ? '/vet' : '/farmer', { replace: true });
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      clearTimeout(timer);
      setLongLoading(false);
      setLoading(false);
    }
  }

  const handleDemoFill = (role) => {
    setUsername(role === 'farmer' ? 'farmer1' : 'vet1');
    setPassword(role === 'farmer' ? 'farmer123' : 'vet123');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8F9FA',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Subtle topographic / background rings instead of generic green blobs */}
      <div style={{ position: 'absolute', top: '-10vw', right: '-10vw', width: '40vw', height: '40vw', borderRadius: '50%', border: '1px solid rgba(30,108,69,0.05)' }}></div>
      <div style={{ position: 'absolute', top: '-5vw', right: '-5vw', width: '30vw', height: '30vw', borderRadius: '50%', border: '1px solid rgba(30,108,69,0.05)' }}></div>
      <div style={{ position: 'absolute', bottom: '-15vw', left: '-10vw', width: '50vw', height: '50vw', borderRadius: '50%', border: '1px solid rgba(30,108,69,0.03)' }}></div>

      <div style={{
        background: '#FFFFFF',
        width: '100%',
        maxWidth: '440px',
        borderRadius: '16px',
        padding: '48px 40px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid #E8EAED'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '16px', padding: '12px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid #E8EAED' }}>
            <Logo size={56} color="#1E6C45" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C1E21', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Pashuraksha</h1>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#1E6C45', margin: '0 0 6px 0' }}>Pashu Swasthya Rakshak</h2>
          <p style={{ fontSize: '0.85rem', color: '#5F6368', margin: 0, fontWeight: '500' }}>Animal Health Surveillance & Response</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div>
            <label htmlFor="username" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1C1E21', marginBottom: '8px' }}>Username</label>
            <input 
              id="username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1.5px solid #E8EAED', fontSize: '1rem', color: '#1C1E21', background: '#FFFFFF', transition: 'all 0.2s ease', outline: 'none'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1E6C45'; e.target.style.boxShadow = '0 0 0 3px #EBF3ED'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E8EAED'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1C1E21', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 44px 14px 16px', borderRadius: '8px', border: '1.5px solid #E8EAED', fontSize: '1rem', color: '#1C1E21', background: '#FFFFFF', transition: 'all 0.2s ease', outline: 'none'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1E6C45'; e.target.style.boxShadow = '0 0 0 3px #EBF3ED'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E8EAED'; e.target.style.boxShadow = 'none'; }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368', padding: '4px', display: 'flex' }}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: '#1E6C45', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = '#14492E')}
            onMouseOut={(e) => !loading && (e.target.style.background = '#1E6C45')}
          >
            {loading ? (longLoading ? 'Waking up secure server...' : 'Signing in...') : 'SIGN IN'} {loading ? null : <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Roles Container */}
        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #E8EAED' }}>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Demo Environment
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => handleDemoFill('farmer')}
              style={{ padding: '12px 8px', background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1E6C45'; e.currentTarget.style.background = '#F8F9FA'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E8EAED'; e.currentTarget.style.background = '#FFFFFF'; }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1C1E21', marginBottom: '2px' }}>FARMER DEMO</div>
              <div style={{ fontSize: '0.7rem', color: '#5F6368' }}>Report & Herd</div>
            </button>
            
            <button 
              type="button"
              onClick={() => handleDemoFill('vet')}
              style={{ padding: '12px 8px', background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1E6C45'; e.currentTarget.style.background = '#F8F9FA'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E8EAED'; e.currentTarget.style.background = '#FFFFFF'; }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1C1E21', marginBottom: '2px' }}>VET DEMO</div>
              <div style={{ fontSize: '0.7rem', color: '#5F6368' }}>Surveillance & Ops</div>
            </button>
          </div>
        </div>

      </div>
      
      {/* Trust Footer */}
      <div style={{ position: 'absolute', bottom: '24px', left: '0', right: '0', textAlign: 'center', fontSize: '0.8rem', color: '#5F6368', fontWeight: '500' }}>
        Field Reporting &nbsp;&bull;&nbsp; Early Warning &nbsp;&bull;&nbsp; Veterinary Response<br/>
        <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '8px', display: 'block' }}>Maharashtra Animal Health Surveillance</span>
      </div>
    </div>
  );
}
