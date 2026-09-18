const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Login.css');
let css = fs.readFileSync(file, 'utf8');

if (!css.includes('.mobile-header')) {
    css += `\n\n@media (min-width: 1024px) {\n  .mobile-header {\n    display: none !important;\n  }\n}\n`;
    fs.writeFileSync(file, css, 'utf8');
}
console.log('Login.css mobile header patched');
