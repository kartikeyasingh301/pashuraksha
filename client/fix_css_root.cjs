const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(file, 'utf8');

// Replace the entire broken :root block with a clean, complete one
const oldRoot = css.match(/:root\s*\{[\s\S]*?\}/);
if (!oldRoot) { console.error('Could not find :root block!'); process.exit(1); }

const newRoot = `:root {
  /* === Core Brand (Pashuraksha Deep Forest Green) === */
  --color-primary: #1E6C45;
  --color-primary-dark: #14492E;
  --brand-50: #ecfdf5;
  --brand-100: #d1fae5;
  --brand-600: #1E6C45;
  --brand-700: #14492E;
  --brand-800: #0d3120;

  /* === Semantic Colours === */
  --success-bg: #DCFCE7;
  --success-text: #15803D;
  --warning-bg: #FEF3C7;
  --warning-text: #B45309;
  --danger-bg: #FEE2E2;
  --danger-text: #B91C1C;
  --info-bg: #DBEAFE;
  --info-text: #1D4ED8;

  /* === Neutrals === */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --color-border: #E2E8F0;
  --border: #E2E8F0;
  --color-card: #FFFFFF;
  --surface: #FFFFFF;
  --bg: #F6F8F7;

  /* === Shadows === */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.07);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);

  /* === Typography === */
  --font: system-ui, "Inter", "Noto Sans", sans-serif;
  --font-base: system-ui, "Inter", "Noto Sans", "Noto Sans Devanagari", sans-serif;

  /* === Spacing === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* === Radius === */
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-pill: 999px;

  /* === Categorical === */
  --cat-1: #4F46E5;
  --cat-2: #0891B2;
  --cat-3: #7C3AED;
  --cat-4: #64748B;
}`;

css = css.replace(oldRoot[0], newRoot);
fs.writeFileSync(file, css, 'utf8');
console.log('CSS :root block fixed successfully!');
