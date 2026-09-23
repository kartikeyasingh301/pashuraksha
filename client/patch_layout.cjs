const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/Layout.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add state
code = code.replace(
  "const [showConfirmLogout, setShowConfirmLogout] = useState(false);",
  "const [showConfirmLogout, setShowConfirmLogout] = useState(false);\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);"
);

// Add hamburger button to header
const headerLeftSearch = `<div className="header-brand">
              {role !== 'vet' && <span className="header-logo"><Logo size={24} color="white" /></span>}`;
const headerLeftReplace = `{role !== 'vet' && !showBack && (
                <button className="hamburger-btn" onClick={() => setIsDrawerOpen(true)} aria-label="Open Menu">
                  <Menu size={24} />
                </button>
              )}
              <div className="header-brand">
              {role !== 'vet' && showBack && <span className="header-logo"><Logo size={24} color="white" /></span>}`;

code = code.replace(headerLeftSearch, headerLeftReplace);

// Add drawer UI right above the <header>
const drawerUI = `
        {/* Mobile Drawer */}
        {role !== 'vet' && (
          <>
            {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />}
            <div className={\`drawer \${isDrawerOpen ? 'open' : ''}\`}>
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
                  <Home size={20} /> Dashboard
                </NavLink>
                <NavLink to="/farmer/report" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Heart size={20} /> Report Health Issue
                </NavLink>
                <NavLink to="/farmer/herd" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <FileText size={20} /> My Herd Ledger
                </NavLink>
                <NavLink to="/farmer/passbook" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Syringe size={20} /> Vaccine Passbook
                </NavLink>
                <NavLink to="/farmer/advisory" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <BookOpen size={20} /> Health Advisories
                </NavLink>
                
                <div style={{ height: '1px', background: '#eee', margin: '16px 0' }}></div>
                <div style={{ padding: '0 24px 8px 24px', fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>HELP & SETTINGS</div>
                <NavLink to="/farmer/about" className={({ isActive }) => "drawer-link" + (isActive ? " active" : "")} onClick={() => setIsDrawerOpen(false)}>
                  <Info size={20} /> About PashuSuraksha
                </NavLink>
              </div>
            </div>
          </>
        )}
`;

code = code.replace('<header className="app-header">', drawerUI + '\n        <header className="app-header">');

fs.writeFileSync(file, code);
console.log("Layout UI patched");
