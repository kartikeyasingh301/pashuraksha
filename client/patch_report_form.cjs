const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<div className="page-content"/g,
  '<div className="page-content form-content"'
);

fs.writeFileSync(file, code, 'utf8');

const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('.form-content')) {
  css += `\n.layout-farmer .page-content.form-content { max-width: 480px !important; }\n`;
  fs.writeFileSync(cssFile, css, 'utf8');
}

console.log('Report Form constrained to 480px!');
