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

// 1. ReportForm.jsx
replaceAllInFile('pages/farmer/ReportForm.jsx', /"Rajkot"/g, '"Nashik"');

// 2. AdvisoryBroadcast.jsx
replaceAllInFile('pages/vet/AdvisoryBroadcast.jsx', /Rajkot/g, 'Nashik');

// 3. Layout.jsx html lang tag
replaceAllInFile('components/Layout.jsx',
  /export default function Layout\(\{ children, title, hero, showBack = false, headerActions = null, lang = null, setLang = null \}\) \{/g,
  `import { useEffect } from 'react';\nexport default function Layout({ children, title, hero, showBack = false, headerActions = null, lang = null, setLang = null }) {\n  useEffect(() => {\n    if (lang) document.documentElement.lang = lang;\n  }, [lang]);`
);
// Layout.jsx didn't import useEffect from react because I overwrote the import statement?
// Let's ensure useEffect is imported
replaceAllInFile('components/Layout.jsx',
  /import React, \{ useState \} from 'react';/g,
  `import React, { useState, useEffect } from 'react';`
);

// 4. index.css for focus rings
const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes(':focus-visible')) {
  css += `\n/* Phase 5: Accessibility */\n:focus-visible {\n  outline: 2px solid var(--brand-600);\n  outline-offset: 2px;\n}\n`;
  fs.writeFileSync(cssFile, css, 'utf8');
}

console.log("Phase 5 applied");
