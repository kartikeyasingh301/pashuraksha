import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Power, WifiOff, RefreshCw, ArrowLeft, Menu, X, FileText, Syringe, Info, Heart } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import StatusBar from './StatusBar.jsx';
import { useSyncContext } from '../contexts/SyncContext.jsx';
import Chatbot from './Chatbot.jsx';

const FARMER_NAV = [
  { to: '/farmer', icon: <Home size={24} />, label: 'Dashboard' },
  { to: '/farmer/report', icon: <Heart size={24} />, label: 'Report Health Issue' },
  { to: '/farmer/herd', icon: <FileText size={24} />, label: 'My Herd Ledger' },
  { to: '/farmer/passbook', icon: <Syringe size={24} />, label: 'Vaccine Passbook' },
  { to: '/farmer/advisory', icon: <BookOpen size={24} />, label: 'Health Advisories' },
];

const VET_NAV = [
  { to: '/vet', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
  { to: '/vet/alerts', icon: <AlertTriangle size={24} />, label: 'Outbreak Alerts' },
  { to: '/vet/map', icon: <MapIcon size={24} />, label: 'Disease Map' },
  { to: '/vet/queue', icon: <ClipboardList size={24} />, label: 'Pending Cases' },
];

function SyncIndicator({ isOnline, pendingCount, isSyncing }) {
  if (!isOnline) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: '700', border: '1px solid var(--warning-text)' }}>
        <WifiOff size={14} /> Offline {pendingCount > 0 && `(${pendingCount})`}
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
  // Note: bottom nav only uses the first 3 or 4 items due to space constraints on farmer
  const navItems = role === 'vet' ? VET_NAV : FARMER_NAV.filter(n => ['Dashboard', 'Report Health Issue', 'Health Advisories'].includes(n.label));
  const drawerItems = role === 'vet' ? VET_NAV : FARMER_NAV;
  
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const translate = (enText) => {
    if (lang === 'hi') {
      const map = {
        'MAIN MENU': 'मुख्य मेनू', 'Dashboard': 'डैशबोर्ड',
        'Report Health Issue': 'बीमारी की रिपोर्ट करें', 'My Herd Ledger': 'मेरा पशु लेजर',
        'Vaccine Passbook': 'टीकाकरण पासबुक', 'Health Advisories': 'स्वास्थ्य सलाह',
        'HELP & SETTINGS': 'सहायता एवं सेटिंग्स', 'About PashuSuraksha': 'पशुसुरक्षा के बारे में',
        'Outbreak Alerts': 'प्रकोप अलर्ट', 'Disease Map': 'बीमारी का नक्शा', 'Pending Cases': 'लंबित मामले'
      };
      return map[enText] || enText;
    }
    if (lang === 'mr') {
      const map = {
        'MAIN MENU': 'मुख्य मेनू', 'Dashboard': 'डॅशबोर्ड',
        'Report Health Issue': 'आजाराची नोंद करा', 'My Herd Ledger': 'माझे पशु खाते',
        'Vaccine Passbook': 'लसीकरण पासबुक', 'Health Advisories': 'आरोग्य सल्ला',
        'HELP & SETTINGS': 'मदत आणि सेटिंग्ज', 'About PashuSuraksha': 'पशुसुरक्षा बद्दल',
        'Outbreak Alerts': 'प्रकोप इशारे', 'Disease Map': 'रोग नकाशा', 'Pending Cases': 'प्रलंबित प्रकरणे'
      };
      return map[enText] || enText;
    }
    return enText;
  };

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
        {drawerItems.map((item) => (
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
                <span className="sidebar-label">{translate(item.label)}</span>
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

        {/* ── Sliding Drawer ── */}
        <>
          {/* Dark overlay */}
          {isDrawerOpen && (
            <div
              onClick={() => setIsDrawerOpen(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999 }}
            />
          )}

          {/* Drawer panel */}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px',
            background: 'white', zIndex: 10000, boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
            transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Drawer header */}
            <div style={{ padding:'20px', background:'#1B5E20', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <Logo size={28} color="white" />
                <div style={{ fontSize:'18px', fontWeight:'800', color:'white' }}>PashuSuraksha</div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ background:'transparent', border:'none', color:'white', cursor:'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Drawer links */}
            <div style={{ flex:1, overflowY:'auto', paddingTop:'8px' }}>
              <div style={{ padding:'12px 24px 6px', fontSize:'11px', fontWeight:'700', color:'#aaa', textTransform:'uppercase', letterSpacing:'1.5px' }}>
                {translate('MAIN MENU')}
              </div>
              
              {drawerItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/farmer' || item.to === '/vet'}
                  onClick={() => setIsDrawerOpen(false)}
                  className={({ isActive }) => isActive ? 'drawer-link active' : 'drawer-link'}
                >
                  {React.cloneElement(item.icon, { size: 20 })} {translate(item.label)}
                </NavLink>
              ))}

              <div style={{ height:'1px', background:'#eee', margin:'16px 0' }} />

              <div style={{ padding:'0 24px 6px', fontSize:'11px', fontWeight:'700', color:'#aaa', textTransform:'uppercase', letterSpacing:'1.5px' }}>
                {translate('HELP & SETTINGS')}
              </div>
              {role === 'farmer' && (
                <NavLink
                  to="/farmer/about"
                  onClick={() => setIsDrawerOpen(false)}
                  className={({ isActive }) => isActive ? 'drawer-link active' : 'drawer-link'}
                >
                  <Info size={20} /> {translate('About PashuSuraksha')}
                </NavLink>
              )}

              {role === 'farmer' && <div style={{ height:'1px', background:'#eee', margin:'16px 0' }} />}

              {/* Sign Out */}
              <button
                onClick={() => { setIsDrawerOpen(false); confirmLogout(); }}
                style={{
                  display:'flex', alignItems:'center', gap:'16px',
                  width:'100%', padding:'16px 24px',
                  background:'transparent', border:'none', cursor:'pointer',
                  fontSize:'15px', fontWeight:'600', color:'#C62828',
                  textAlign:'left'
                }}
              >
                <Power size={20} color="#C62828" />
                {lang === 'hi' ? 'साइन आउट करें' : lang === 'mr' ? 'साइन आउट करा' : 'Sign Out'}
              </button>
            </div>
          </div>
        </>

        {/* ── App Header ── */}
        <header className="app-header">
          <div className="header-left">
            {/* Hamburger – on both farmer and vet mobile pages, when not in a sub-page */}
            {!showBack && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open Menu"
                className="hamburger-btn"
                style={{ background:'transparent', border:'none', color:'white', cursor:'pointer', display:'flex', alignItems:'center', padding:'4px', marginRight:'6px' }}
              >
                <Menu size={26} />
              </button>
            )}
            {showBack && (
              <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="header-brand">
              <span className="header-logo"><Logo size={24} color="white" /></span>
              <div>
                <div className="header-app-name">Pashuraksha</div>
                {title && <div className="header-title">{title}</div>}
              </div>
            </div>
          </div>

          <div className="header-right">
            {lang && setLang && (
              <div style={{ display:'flex', alignItems:'center', background:'rgba(0,0,0,0.1)', padding:'2px 8px', borderRadius:'var(--radius-pill)', gap:'4px' }}>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background:'transparent', color:'white', border:'none', outline:'none', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
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
                  <span className="nav-label">{translate(item.label)}</span>
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
