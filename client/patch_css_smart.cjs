const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

// Replace CSS variables
const rootStart = code.indexOf(':root {');
const rootEnd = code.indexOf('}', rootStart) + 1;
const newRoot = `:root {
  /* Core Colors */
  --color-primary: #1E6C45;
  --color-primary-dark: #14492E;
  --color-primary-light: #EBF3ED;
  --color-accent: #F57F17;
  --color-accent-light: #FFF8E1;
  --color-critical: #D32F2F;
  --color-critical-light: #FFEBEE;
  
  /* Surfaces & Text */
  --color-bg: #F8F9FA;
  --color-card: #FFFFFF;
  --color-text: #1C1E21;
  --color-muted: #5F6368;
  --color-border: #E8EAED;
  
  /* Structural Tokens */
  --radius-card: 10px;
  --radius-btn: 6px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.05);
  
  --font: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}`;
code = code.substring(0, rootStart) + newRoot + code.substring(rootEnd);

// Replace button styles
code = code.replace(
    /\.btn\{[^\}]+\}/,
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:var(--radius-btn);font-size:0.9rem;font-weight:600;border:none;cursor:pointer;transition:all 0.2s ease;width:100%;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,0.05)}'
);
code = code.replace(
    /\.btn-primary\{[^\}]+\}/,
    '.btn-primary{background:var(--color-primary);color:white}'
);
code = code.replace(
    /\.btn-primary:hover:not\(:disabled\)\{[^\}]+\}/,
    '.btn-primary:hover:not(:disabled){background:var(--color-primary-dark)}'
);

// Replace card styles
code = code.replace(
    /\.card\{[^\}]+\}/,
    '.card{background:var(--color-card);border-radius:var(--radius-card);padding:16px;margin-bottom:16px;box-shadow:var(--shadow-card);border:1px solid var(--color-border);transition:box-shadow 0.2s}'
);
code = code.replace(
    /\.card:hover\{[^\}]+\}/,
    '.card:hover{box-shadow:var(--shadow-card-hover)}'
);

fs.writeFileSync(file, code, 'utf8');
console.log("CSS systematically upgraded!");
