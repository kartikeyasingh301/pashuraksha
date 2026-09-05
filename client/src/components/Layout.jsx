import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Stethoscope, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import StatusBar from './StatusBar.jsx';
import SyncBadge from './SyncBadge.jsx';
import { useSyncContext } from '../contexts/SyncContext.jsx';

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

export default function Layout({ children, title, showBack = false }) {
  const { user, logout } = useAuth();
  const { pendingCount } = useSyncContext();
  const navigate = useNavigate();
  const role = user?.role;

  const navItems = role === 'vet' ? VET_NAV : FARMER_NAV;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          {showBack && (
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
              &#8592;
            </button>
          )}
          <div className="header-brand">
            <span className="header-logo"><Stethoscope size={28} color="#2E7D32" /></span>
            <div>
              <div className="header-app-name">PashuSuraksha</div>
              {title && <div className="header-title">{title}</div>}
            </div>
          </div>
        </div>
        <div className="header-right">
          <SyncBadge count={pendingCount} />
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="bottom-nav-item"
            style={({ isActive }) =>
              isActive ? { color: '#2E7D32', borderTop: '2px solid #2E7D32' } : {}
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <StatusBar />
    </div>
  );
}