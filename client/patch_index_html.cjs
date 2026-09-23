const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'index.html');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/content='#2E7D32'/g, "content='#1E6C45'");

fs.writeFileSync(file, code, 'utf8');
console.log("index.html theme-color updated!");
