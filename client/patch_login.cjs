const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Login.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import \{ Eye, EyeOff, ArrowRight, ShieldAlert \} from 'lucide-react';/, "import { Eye, EyeOff, ArrowRight, ShieldAlert, User, Stethoscope, Loader2 } from 'lucide-react';");

code = code.replace(/minHeight: '100vh'/g, "minHeight: '100dvh'");

// Add icons to buttons
code = code.replace(/<div style=\{\{ fontSize: '0.8rem', fontWeight: '700', color: '#1C1E21', marginBottom: '2px' \}\}>FARMER DEMO<\/div>/g, 
  `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}><User size={16} color="var(--brand-600)" /> FARMER DEMO</div>`
);

code = code.replace(/<div style=\{\{ fontSize: '0.8rem', fontWeight: '700', color: '#1C1E21', marginBottom: '2px' \}\}>VET DEMO<\/div>/g,
  `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}><Stethoscope size={16} color="var(--brand-600)" /> VET DEMO</div>`
);

// Add spinner to sign in button
code = code.replace(/\{loading \? \(longLoading \? 'Waking up secure server\.\.\.' : 'Signing in\.\.\.'\) : 'SIGN IN'\} \{loading \? null : <ArrowRight size=\{18\} \/>\}/g,
  `{loading ? <><Loader2 size={18} className="animate-spin" /> {longLoading ? 'Waking up secure server...' : 'Signing in...'}</> : <>SIGN IN <ArrowRight size={18} /></>}`
);

// Semantic token replacements for Login
code = code.replace(/#1E6C45/g, 'var(--brand-600)');
code = code.replace(/#14492E/g, 'var(--brand-700)');
code = code.replace(/#EBF3ED/g, 'var(--brand-50)');
code = code.replace(/#FFFFFF/g, 'var(--surface)');
code = code.replace(/#F8F9FA/g, 'var(--bg)');
code = code.replace(/#E8EAED/g, 'var(--border)');
code = code.replace(/#1C1E21/g, 'var(--text-primary)');
code = code.replace(/#5F6368/g, 'var(--text-secondary)');
code = code.replace(/#FFEBEE/g, 'var(--danger-bg)');
code = code.replace(/#D32F2F/g, 'var(--danger-text)');

fs.writeFileSync(file, code, 'utf8');
console.log("Login patched");
