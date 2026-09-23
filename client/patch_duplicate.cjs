const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/lang=\{lang\} setLang=\{setLang\}\s*lang=\{lang\} setLang=\{setLang\}/g, 'lang={lang} setLang={setLang}');
fs.writeFileSync(file, code, 'utf8');
