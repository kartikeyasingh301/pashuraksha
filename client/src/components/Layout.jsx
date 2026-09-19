import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Power, CheckCircle, WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import StatusBar from './StatusBar.jsx';
import { useSyncContext } from '../contexts/SyncContext.jsx';
import Chatbot from './Chatbot.jsx';

const FARMER_NAV = [
  { to: '/farmer', icon: <Home size={24} />, label: 'Home' },
  { to: '/farmer/report', icon: <ClipboardList size={24} />, label: 'Report' },
  { to: '/farmer/advisory', icon: <BookOpen size={24} />, label: 'Advisory' },
];

const VET_NAV = [
  { to: '/vet', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
  { to: '/vet/alerts', icon: <AlertTriangle size={24} />, label: 'Alerts' },
  { to: '/vet/map', icon: <MapIcon size={24} />, label: 'Map' },
  { to: '/vet/queue', icon: <ClipboardList size={24} />, label: 'Queue' },
];

function SyncIndicator({ isOnline, pendingCount, isSyncing }) {
  if (!isOnline) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: '700', border: '1px solid var(--warning-text)' }}>
        <WifiOff size={14} /> Offline - reports are saved on this device and will sync {pendingCount > 0 && `(${pendingCount})`}
      </div>
    );
  }
  if (isSyncing || pendingCount > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--info-text)', fontSize: '12px', fontWeight: '700' }}>
        <RefreshCw size={14} className="animate-spin" /> Syncing... {pendingCount > 0 && `(${pendingCount})`}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-text)', fontSize: '12px', fontWeight: '700' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-text)' }}></div>
    </div>
  );
}

export default function Layout({ children, title, hero, showBack = false, headerActions = null, lang = null, setLang = null }) {
  useEffect(() => {
    if (lang) document.documentElement.lang = lang;
  }, [lang]);
  const { user, logout } = useAuth();
  const { isOnline, pendingCount, isSyncing } = useSyncContext();
  const navigate = useNavigate();
  const role = user?.role;
  const navItems = role === 'vet' ? VET_NAV : FARMER_NAV;
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
    }
  };

  const Sidebar = () => (
    <aside className="vet-sidebar">
      <div className="sidebar-brand">
        <Logo size={32} color="var(--brand-600)" />
        <div>
          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--brand-700)' }}>Pashuraksha</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Veterinary Command</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "sidebar-nav-item" + (isActive ? " active" : "")}
            end={item.to === '/farmer' || item.to === '/vet'}
          >
            {({ isActive }) => (
              <>
                <span className="sidebar-icon">
                  {React.cloneElement(item.icon, { fill: isActive ? "currentColor" : "none", strokeWidth: isActive ? 2 : 2 })}
                </span>
                <span className="sidebar-label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ marginBottom: '16px' }}>
          <SyncIndicator isOnline={isOnline} pendingCount={pendingCount} isSyncing={isSyncing} />
        </div>
        <button className="sidebar-logout" onClick={confirmLogout}>
          <Power size={18} /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className={`app-layout ${role === 'vet' ? 'layout-vet' : 'layout-farmer'}`}>
      
      {role === 'vet' && <Sidebar />}

      <div className="layout-content-wrapper">
        <header className="app-header">
          <div className="header-left">
            {showBack && (
              <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="header-brand">
              {role !== 'vet' && <span className="header-logo"><Logo size={24} color="white" /></span>}
              <div>
                {role !== 'vet' && <div className="header-app-name">Pashuraksha</div>}
                {title && <div className="header-title">{title}</div>}
              </div>
            </div>
          </div>
          <div className="header-right">
            {lang && setLang && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', gap: '4px' }}>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <option value="en" style={{color:'black'}}>English</option>
                  <option value="hi" style={{color:'black'}}>हिंदी</option>
                  <option value="mr" style={{color:'black'}}>मराठी</option>
                </select>
              </div>
            )}
            {headerActions}
            {role !== 'vet' && <SyncIndicator isOnline={isOnline} pendingCount={pendingCount} isSyncing={isSyncing} />}
            <button className="logout-btn" onClick={confirmLogout} title="Sign out" aria-label="Sign out">
              <Power size={20} />
            </button>
          </div>
        </header>

        <main className="app-main">
          {hero && <div className="layout-hero">{hero}</div>}
          {children}
        </main>

        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
              end={item.to === '/farmer' || item.to === '/vet'}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              {({ isActive }) => (
                <>
                  <span className="nav-icon">
                    {React.cloneElement(item.icon, { fill: isActive ? "currentColor" : "none", strokeWidth: isActive ? 2 : 2 })}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {role !== 'vet' && <Chatbot />}
        <StatusBar />
      </div>
    </div>
  );
}
