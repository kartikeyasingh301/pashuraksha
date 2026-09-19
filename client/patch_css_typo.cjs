const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/@media \(min-width: 10var\(--space-4\)\)/g, '@media (min-width: 1024px)');

fs.writeFileSync(file, code, 'utf8');
console.log('CSS typo patched!');
