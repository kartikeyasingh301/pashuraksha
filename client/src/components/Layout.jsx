import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Power, CheckCircle, WifiOff, RefreshCw, ArrowLeft, Menu, X, FileText, Syringe, Info, Heart } from 'lucide-react';
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

  const translate = (enText) => {
    if (lang === 'hi') {
      if (enText === 'MAIN MENU') return 'मुख्य मेनू';
      if (enText === 'Dashboard') return 'डैशबोर्ड';
      if (enText === 'Report Health Issue') return 'बीमारी की रिपोर्ट करें';
      if (enText === 'My Herd Ledger') return 'मेरा पशु लेजर';
      if (enText === 'Vaccine Passbook') return 'टीकाकरण पासबुक';
      if (enText === 'Health Advisories') return 'स्वास्थ्य सलाह';
      if (enText === 'HELP & SETTINGS') return 'सहायता एवं सेटिंग्स';
      if (enText === 'About PashuSuraksha') return 'पशुसुरक्षा के बारे में';
    }
    if (lang === 'mr') {
      if (enText === 'MAIN MENU') return 'मुख्य मेनू';
      if (enText === 'Dashboard') return 'डॅशबोर्ड';
      if (enText === 'Report Health Issue') return 'आजाराची नोंद करा';
      if (enText === 'My Herd Ledger') return 'माझे पशु खाते';
      if (enText === 'Vaccine Passbook') return 'लसीकरण पासबुक';
      if (enText === 'Health Advisories') return 'आरोग्य सल्ला';
      if (enText === 'HELP & SETTINGS') return 'मदत आणि सेटिंग्ज';
      if (enText === 'About PashuSuraksha') return 'पशुसुरक्षा बद्दल';
    }
    return enText;
  };

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        
        {/* Mobile Drawer */}
        {role !== 'vet' && (
          <>
            {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />}
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
              <div className="drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Logo size={28} color="white" />
                  <div style={{ fontSize: '18px', fontWeight: '800' }}>PashuSuraksha</div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={24} /></button>
              </div>
              <div className="drawer-links">
                <div style={{ padding: '0 24px 8px 24px', fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>MAIN MENU</div>
                <NavLink to="/farmer" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} end onClick={() => setIsDrawerOpen(false)}>
                  <Home size={20} /> {translate('Dashboard')}
                </NavLink>
                <NavLink to="/farmer/report" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Heart size={20} /> {translate('Report Health Issue')}
                </NavLink>
                <NavLink to="/farmer/herd" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <FileText size={20} /> {translate('My Herd Ledger')}
                </NavLink>
                <NavLink to="/farmer/passbook" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Syringe size={20} /> {translate('Vaccine Passbook')}
                </NavLink>
                <NavLink to="/farmer/advisory" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <BookOpen size={20} /> {translate('Health Advisories')}
                </NavLink>
                
                <div style={{ height: '1px', background: '#eee', margin: '16px 0' }}></div>
                <div style={{ padding: '0 24px 8px 24px', fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>HELP & SETTINGS</div>
                <NavLink to="/farmer/about" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Info size={20} /> {translate('About PashuSuraksha')}
                </NavLink>
              </div>
            </div>
          </>
        )}

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
