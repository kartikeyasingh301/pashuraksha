const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

const rootReplacement = `:root {
  /* Brand */
  --brand-50: #ecfdf5;
  --brand-100: #d1fae5;
  --brand-600: #1E6C45;
  --brand-700: #047857;
  --brand-800: #065f46;

  /* Semantic */
  --success-bg: #DCFCE7;
  --success-text: #15803D;
  --warning-bg: #FEF3C7;
  --warning-text: #B45309;
  --danger-bg: #FEE2E2;
  --danger-text: #B91C1C;
  --info-bg: #DBEAFE;
  --info-text: #1D4ED8;

  /* Neutrals */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --border: #E2E8F0;
  --surface: #FFFFFF;
  --bg: #F6F8F7;

  /* Categorical */
  --cat-1: #4F46E5;
  --cat-2: #0891B2;
  --cat-3: #7C3AED;
  --cat-4: #64748B;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Structural */
  --radius-card: 12px;
  --radius-btn: 10px;
  --radius-pill: 999px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  /* Typography */
  --font-base: system-ui, "Noto Sans", "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif;
}

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-base);
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
:lang(hi), :lang(mr), :lang(gu) {
  line-height: 1.65;
}
h1, h2, h3, h4, h5, h6, button, .btn {
  text-transform: none !important;
}
.eyebrow {
  text-transform: uppercase !important;
  font-size: 12px;
  letter-spacing: 0.05em;
}
`;

// Replace everything from :root down to the end of body block
code = code.replace(/:root\s*\{[\s\S]*?\}\s*html\s*\{[\s\S]*?\}\s*body\s*\{[\s\S]*?\}/m, rootReplacement);

// Hex Replacements to vars
code = code.replace(/#1E6C45|#2E7D32|#1B5E20|#14492E/gi, 'var(--brand-600)');
code = code.replace(/#EBF3ED|#E8F5E9/gi, 'var(--brand-50)');
code = code.replace(/#C62828|#D32F2F|#B71C1C|#ef4444/gi, 'var(--danger-text)');
code = code.replace(/#FFEBEE|#FFCDD2/gi, 'var(--danger-bg)');
code = code.replace(/#F57F17|#E65100|#f97316/gi, 'var(--warning-text)');
code = code.replace(/#FFF8E1/gi, 'var(--warning-bg)');
code = code.replace(/#1976D2|#1565C0/gi, 'var(--info-text)');
code = code.replace(/#E3F2FD|#BBDEFB/gi, 'var(--info-bg)');
code = code.replace(/#22c55e|#4CAF50/gi, 'var(--success-text)');
code = code.replace(/#1C1E21|#333333|#333|#212121|#000/gi, 'var(--text-primary)');
code = code.replace(/#5F6368|#666666|#666|#757575|#616161|#424242|#555/gi, 'var(--text-secondary)');
code = code.replace(/#E8EAED|#eee|#E0E0E0|#f0f0f0|#F5F5F5/gi, 'var(--border)');
code = code.replace(/#F8F9FA|#fafafa/gi, 'var(--bg)');
code = code.replace(/#FFFFFF|#fff|white/gi, 'var(--surface)');
code = code.replace(/10px/g, 'var(--radius-btn)');
code = code.replace(/12px/g, 'var(--radius-card)');
code = code.replace(/20px|24px|16px/g, 'var(--space-4)'); // rough spacing normalize

fs.writeFileSync(file, code, 'utf8');
console.log("Phase 1: Design tokens applied.");
