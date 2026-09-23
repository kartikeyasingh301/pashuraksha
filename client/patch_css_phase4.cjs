const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

const css = `
/* Phase 4: Buttons & Cards */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 16px; border-radius: var(--radius-btn);
  font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;
  border: none; background: transparent; white-space: nowrap;
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: var(--brand-600); color: white; border: 1.5px solid var(--brand-600); }
.btn-primary:hover:not(:disabled) { background: var(--brand-700); border-color: var(--brand-700); }
.btn-secondary, .btn-outline { background: transparent; border: 1.5px solid var(--brand-600); color: var(--brand-600); }
.btn-secondary:hover:not(:disabled), .btn-outline:hover:not(:disabled) { background: var(--brand-50); }
.btn-tertiary { background: transparent; border: 1.5px solid transparent; color: var(--brand-600); }
.btn-tertiary:hover:not(:disabled) { background: var(--brand-50); }
.btn-destructive { background: var(--danger-bg); color: var(--danger-text); border: 1.5px solid var(--danger-text); }
.btn-block { width: 100%; }

.action-row { display: flex; gap: 12px; margin-top: 16px; }
.action-row .btn { flex: 1; }

.card {
  background: var(--surface); border-radius: var(--radius-card); padding: 16px;
  box-shadow: var(--shadow-sm); border: 1px solid var(--border);
  display: flex; flex-direction: column;
}
.card-critical { border-left: 4px solid var(--danger-text); }
.card-high { border-left: 4px solid var(--warning-text); }
.card-routine { border-left: 4px solid var(--text-secondary); }

/* Skeletons */
.skeleton {
  background: linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-text { height: 16px; width: 100%; margin-bottom: 8px; }
.skeleton-title { height: 24px; width: 60%; margin-bottom: 12px; }
.skeleton-circle { width: 40px; height: 40px; border-radius: 50%; }

/* Form Elements */
.form-control, .searchable-select {
  width: 100%; min-height: 44px; padding: 10px 14px;
  border: 1.5px solid var(--border); border-radius: var(--radius-btn);
  font-size: 14px; background: var(--surface); color: var(--text-primary);
  outline: none; transition: border-color 0.2s; font-family: var(--font-base);
}
.form-control:focus, .searchable-select:focus { border-color: var(--brand-600); box-shadow: 0 0 0 3px var(--brand-50); }

/* Stepper */
.stepper { display: flex; align-items: center; gap: 16px; background: var(--bg); padding: 4px; border-radius: var(--radius-btn); width: max-content; }
.stepper-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; color: var(--brand-600); }
.stepper-val { font-size: 16px; font-weight: 700; min-width: 24px; text-align: center; }

/* Sticky Submit Bar */
.sticky-submit { position: sticky; bottom: 0; background: var(--surface); padding: 16px; border-top: 1px solid var(--border); box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 10; margin: 0 -20px -100px -20px; }
`;

code += css;
fs.writeFileSync(file, code, 'utf8');
console.log("CSS patched with Phase 4 Components!");
