const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');

const modernCSS = `/* ===== PASHURAKSHA - PROFESSIONAL DESIGN SYSTEM ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Core Colors */
  --color-primary: #1E6C45; /* Deeper, more trustworthy green */
  --color-primary-dark: #14492E;
  --color-primary-light: #EBF3ED;
  
  /* Semantic Colors */
  --color-critical: #D32F2F; /* Deep red for critical */
  --color-critical-light: #FFEBEE;
  --color-warning: #F57F17; /* High visibility amber */
  --color-warning-light: #FFF8E1;
  --color-info: #1976D2; /* Standard professional blue */
  --color-info-light: #E3F2FD;
  --color-purple: #6A1B9A; /* For One Health / Zoonotic */
  
  /* Surfaces & Text */
  --color-bg: #F8F9FA; /* Calmer off-white background */
  --color-card: #FFFFFF;
  --color-text: #1C1E21; /* Strong but not pure black */
  --color-muted: #5F6368; /* Readable gray */
  --color-border: #E8EAED;
  
  /* Structural Tokens */
  --radius-card: 10px;
  --radius-btn: 6px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.05);
  
  --font: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

img, svg { display: block; max-width: 100%; }

/* Shell */
.app-shell { display: flex; flex-direction: column; min-height: 100vh; }
.header { height: 60px; background: var(--color-primary-dark); color: white; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; box-shadow: var(--shadow-md); position: sticky; top: 0; z-index: 100; }
.page-content { flex: 1; padding: 20px; max-width: 1200px; margin: 0 auto; width: 100%; }
.bottom-nav { height: 64px; background: white; border-top: 1px solid var(--color-border); display: flex; justify-content: space-around; align-items: center; position: sticky; bottom: 0; z-index: 100; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--color-muted); font-size: 0.75rem; font-weight: 600; text-decoration: none; padding: 8px 12px; }
.nav-item.active { color: var(--color-primary); }

/* Typography Hierarchy */
h1 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); letter-spacing: -0.02em; }
h2 { font-size: 1.25rem; font-weight: 700; color: var(--color-text); }
h3 { font-size: 1rem; font-weight: 700; color: var(--color-text); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
.text-muted { color: var(--color-muted); }
.text-caption { font-size: 0.85rem; color: var(--color-muted); }

/* Cards & Surfaces */
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}
.card:hover { box-shadow: var(--shadow-md); }
.card-title { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 18px; border-radius: var(--radius-btn);
  font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer;
  transition: all 0.2s ease; text-align: center;
}
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn-danger { background: var(--color-critical); color: white; }
.btn-outline { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
.btn-outline:hover:not(:disabled) { background: var(--color-primary-light); }
.btn-sm { padding: 6px 12px; font-size: 0.8rem; }
.btn-block { width: 100%; }

/* Forms */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text); margin-bottom: 8px; }
.form-control {
  width: 100%; padding: 12px 16px; border: 1.5px solid var(--color-border);
  border-radius: var(--radius-btn); font-size: 1rem; color: var(--color-text);
  background: var(--color-card); transition: all 0.2s ease; outline: none; appearance: none;
}
.form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-control-error { border-color: var(--color-critical); }
.form-error { display: block; font-size: 0.8rem; color: var(--color-critical); margin-top: 6px; }

/* Badges */
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-critical { background: var(--color-critical-light); color: var(--color-critical); }
.badge-warning { background: var(--color-warning-light); color: var(--color-warning); }
.badge-success { background: var(--color-primary-light); color: var(--color-primary); }
.badge-info { background: var(--color-info-light); color: var(--color-info); }

/* Tables */
.table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { padding: 12px 16px; border-bottom: 2px solid var(--color-border); color: var(--color-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
td { padding: 14px 16px; border-bottom: 1px solid var(--color-border); font-size: 0.95rem; color: var(--color-text); }
tr:last-child td { border-bottom: none; }

/* States */
.empty-state { text-align: center; padding: 48px 20px; color: var(--color-muted); }
.empty-state p { margin-top: 8px; font-size: 0.95rem; max-width: 300px; margin-inline: auto; }

/* Map Specific */
.map-page { display: flex; flex-direction: column; height: calc(100vh - 60px - 60px - 36px); }
.map-filter-row { display: flex; gap: 8px; padding: 12px 16px; overflow-x: auto; background: var(--color-card); border-bottom: 1px solid var(--color-border); }
.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--color-border); background: var(--color-card); font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap; color: var(--color-muted); transition: all 0.2s; }
.filter-btn-active { background: var(--color-text); color: white; border-color: var(--color-text); }
.map-container-wrapper { flex: 1; position: relative; overflow: hidden; }

/* General Utilities */
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.w-full { width: 100%; }
`;

fs.writeFileSync(file, modernCSS, 'utf8');
console.log("Professional design system injected into index.css!");
