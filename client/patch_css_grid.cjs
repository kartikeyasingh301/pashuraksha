const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\.farmer-desktop-grid/g, '.desktop-grid');
code = code.replace(/\.farmer-main-col/g, '.main-col');
code = code.replace(/\.farmer-side-col/g, '.side-col');

fs.writeFileSync(file, code, 'utf8');
console.log('CSS grid generalized!');
