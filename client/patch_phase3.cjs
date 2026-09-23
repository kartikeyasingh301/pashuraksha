const fs = require('fs');
const path = require('path');

function replaceAllInFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    code = code.replace(regex, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

// 1. Layout Language Props
replaceAllInFile('components/Layout.jsx', 
  /export default function Layout\(\{ children, title, hero, showBack = false, headerActions = null \}\) \{/g,
  `export default function Layout({ children, title, hero, showBack = false, headerActions = null, lang = null, setLang = null }) {`
);

replaceAllInFile('components/Layout.jsx',
  /\{headerActions\}/g,
  `{lang && setLang && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', gap: '4px' }}>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <option value="en" style={{color:'black'}}>English</option>
                  <option value="hi" style={{color:'black'}}>Hindi</option>
                  <option value="mr" style={{color:'black'}}>Marathi</option>
                </select>
              </div>
            )}
            {headerActions}`
);

// 2. Remove inline language selectors from Farmer pages and pass to Layout
['pages/farmer/Dashboard.jsx', 'pages/farmer/Advisory.jsx', 'pages/farmer/ReportForm.jsx'].forEach(file => {
  replaceAllInFile(file, /<Layout title="(.*?)"(.*?)>/g, `<Layout title="$1" lang={lang} setLang={setLang} $2>`);
  replaceAllInFile(file, /<Layout(.*?)title="(.*?)"(.*?)>/g, `<Layout$1title="$2" lang={lang} setLang={setLang}$3>`);
  
  // Try finding <Layout> without title
  if (!fs.readFileSync(path.join(__dirname, 'src', file), 'utf8').includes('lang={lang}')) {
     replaceAllInFile(file, /<Layout(.*?)>/, `<Layout lang={lang} setLang={setLang} $1>`);
  }

  // Remove the old pill
  replaceAllInFile(file, /<div style=\{\{\s*position:\s*["']absolute["'],\s*top:\s*["']16px["'],\s*right:\s*["']16px["'][\s\S]*?<\/div>/g, '');
  // Or if it's floating somewhere else:
  replaceAllInFile(file, /\{\/\*\s*Language Switcher\s*\*\/\}\s*<div[^>]*>[\s\S]*?<\/select>\s*<\/div>/g, '');
});

// 3. Update SyncIndicator inside Layout.jsx
// Prompt: Sync-status component: Online = subtle dot; Offline = amber banner "Offline - reports are saved on this device and will sync"; Syncing = spinner; show a pending count if available.
replaceAllInFile('components/Layout.jsx',
  /function SyncIndicator\(\{ isOnline, pendingCount, isSyncing \}\) \{[\s\S]*?return \([\s\S]*?Online[\s\S]*?\);\s*\}/,
  `function SyncIndicator({ isOnline, pendingCount, isSyncing }) {
  if (!isOnline) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: '700', border: '1px solid var(--warning-text)' }}>
        <WifiOff size={14} /> Offline - reports are saved on this device and will sync {pendingCount > 0 && \`(\${pendingCount})\`}
      </div>
    );
  }
  if (isSyncing || pendingCount > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--info-text)', fontSize: '12px', fontWeight: '700' }}>
        <RefreshCw size={14} className="animate-spin" /> Syncing... {pendingCount > 0 && \`(\${pendingCount})\`}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-text)', fontSize: '12px', fontWeight: '700' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-text)' }}></div>
    </div>
  );
}`
);

// 4. Fix Modal logic in CriticalAlerts.jsx
// bottom sheet below 768px, centred on desktop. max-height 90dvh, sticky header and sticky CTA that never overlaps the status bar, overlay rgba(15,23,42,.5), focus trap, Esc to close, restore focus.
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /background: "rgba\(0,0,0,0\.6\)"/g,
  `background: "rgba(15,23,42,0.5)"`
);

// We need to implement the desktop centering + bottom sheet logic.
// We can do this with CSS classes.
let cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes('.signal-modal-overlay')) {
  css += `
/* Phase 3: Signal Modal */
.signal-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0;
}
.signal-modal-content {
  background: var(--surface);
  width: 100%;
  max-width: 600px;
  max-height: 90dvh;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
}
@media (min-width: 768px) {
  .signal-modal-overlay {
    align-items: center;
    padding: 24px;
  }
  .signal-modal-content {
    border-radius: var(--radius-card);
  }
}
`;
  fs.writeFileSync(cssFile, css, 'utf8');
}

replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /<div style=\{\{\s*position:\s*"fixed",\s*inset:\s*0,\s*background:\s*"rgba\(15,23,42,0\.5\)",\s*zIndex:\s*9999,\s*display:\s*"flex",\s*justifyContent:\s*"center",\s*alignItems:\s*"flex-end",\s*padding:\s*"0"\s*\}\}>/g,
  `<div className="signal-modal-overlay">`
);
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /<div style=\{\{\s*background:\s*"white",\s*width:\s*"100%",\s*maxWidth:\s*"600px",\s*height:\s*"85vh",\s*borderTopLeftRadius:\s*"24px",\s*borderTopRightRadius:\s*"24px",\s*display:\s*"flex",\s*flexDirection:\s*"column",\s*overflow:\s*"hidden"\s*\}\}>/g,
  `<div className="signal-modal-content">`
);

// Esc to close (add a simple useEffect inside OutbreakDNAModal)
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /const actions = item\.sentinel\?\.next_best_actions \|\| \[\];/g,
  `const actions = item.sentinel?.next_best_actions || [];\n  useEffect(() => {\n    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };\n    window.addEventListener('keydown', handleEsc);\n    return () => window.removeEventListener('keydown', handleEsc);\n  }, [onClose]);`
);


console.log("Phase 3 script completed.");
