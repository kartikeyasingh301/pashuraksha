const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Layout.jsx');
let code = fs.readFileSync(file, 'utf8');

// Remove global lang switcher
code = code.replace(
  /\{\s*lang\s*&&\s*setLang\s*&&\s*\([\s\S]*?\)\s*\}/,
  ''
);

fs.writeFileSync(file, code, 'utf8');

// Also revert the form-content 480px constraint from index.css
const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/\.layout-farmer \.page-content\.form-content \{ max-width: 480px !important; \}/, '');
fs.writeFileSync(cssFile, css, 'utf8');

console.log('Global lang removed, 480px constraint reverted!');
