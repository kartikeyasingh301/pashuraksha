const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/var\(--surface\)-space/g, 'white-space');

fs.writeFileSync(file, code, 'utf8');
console.log("Fixed white-space CSS property!");
