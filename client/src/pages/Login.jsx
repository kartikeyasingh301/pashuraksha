import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, User, Stethoscope, MapPin, Activity, Phone, FlaskConical, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [longLoading, setLongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Start long loading timer to show Railway wakeup message
    const timer = setTimeout(() => {
      setLongLoading(true);
    }, 4000);

    const success = await login(username, password);
    clearTimeout(timer);
    
    if (success) {
      if (username.startsWith('vet') || username === 'admin') { navigate('/vet'); }
      
      else { navigate('/farmer'); }
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'farmer') { setUsername('farmer1'); setPassword('farmer123'); }
    else if (role === 'vet') { setUsername('vet1'); setPassword('vet123'); }
    
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL: DESKTOP ONLY */}
      <div className="login-left">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{ background: 'white', padding: '8px', borderRadius: '12px' }}>
              <Logo size={40} color="var(--brand-700, #047857)" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>GOVERNMENT OF MAHARASHTRA</span>
          </div>
          
          <h1 className="login-hero-title">
            Animal Health<br/>
            Surveillance &<br/>
            Response System
          </h1>
          
          <p className="login-hero-subtitle">
            Empowering farmers and veterinarians with early warning disease intelligence, real-time outbreak mapping, and unified operational response.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper"><MapPin size={24} color="white"/></div>
              <div>
                <div className="feature-text">Live Outbreak Mapping</div>
                <div className="feature-sub">Geospatial tracking of emerging syndromic threats</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><Activity size={24} color="white"/></div>
              <div>
                <div className="feature-text">Sentinel Intelligence</div>
                <div className="feature-sub">Early warning detection for FMD, PPR, and zoonotic risks</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><Phone size={24} color="white"/></div>
              <div>
                <div className="feature-text">Omnichannel Reporting</div>
                <div className="feature-sub">Accessible via App, Voice call, and IVR Helpline</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN FORM (MOBILE + DESKTOP) */}
      <div className="login-right">
        <div className="login-card">
          
          {/* Mobile Brand Header (Hidden on Desktop split) */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="mobile-header">
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <Logo size={48} color="var(--brand-600, #047857)" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Pashuraksha</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '500' }}>Animal Health Surveillance</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} /> {error}
              </div>
            )}

            <div>
              <label htmlFor="username" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Username</label>
              <input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="input-field"
                  style={{ paddingRight: '44px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', display: 'flex' }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {longLoading ? 'Waking up secure server...' : 'Signing in...'}</>
              ) : (
                <>SIGN IN <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Demo Roles Container */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              One-Click Demo Access
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button type="button" onClick={() => handleDemoFill('farmer')} className="demo-btn">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <User size={16} color="var(--brand-600, #047857)" /> FARMER
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Report & Herd</div>
              </button>
              
              <button type="button" onClick={() => handleDemoFill('vet')} className="demo-btn">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <Stethoscope size={16} color="var(--brand-600, #047857)" /> VETERINARIAN
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Surveillance Ops</div>
              </button>

            </div>
          </div>
        </div>
        
        {/* Mobile Trust Footer */}
        <div style={{ position: 'absolute', bottom: '24px', left: '0', right: '0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Maharashtra Animal Health Surveillance System
        </div>
      </div>
    </div>
  );
}



