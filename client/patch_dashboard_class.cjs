const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<div className="page-content"/g,
  '<div className="page-content dashboard-content"'
);

fs.writeFileSync(file, code, 'utf8');
console.log('Dashboard class patched!');
