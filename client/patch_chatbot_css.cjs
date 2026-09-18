const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Chatbot.css');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/position: fixed;/g, 'position: absolute;');
code = code.replace(/width: 340px;\s*height: 500px;/g, 'width: 100%; height: calc(100% - 65px); bottom: 65px; right: 0; border-radius: 0; top: 0;');
code = code.replace(/#2E7D32/g, 'var(--brand-600)');
code = code.replace(/#1B5E20/g, 'var(--brand-700)');
code = code.replace(/#388E3C|#43A047/g, 'var(--brand-600)');
fs.writeFileSync(file, code, 'utf8');
console.log("Chatbot CSS patched!");
