const fs = require('fs');
const path = require('path');
const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('.layout-farmer .page-content')) {
    css += `
.layout-farmer .page-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
.layout-farmer .page-content.dashboard-content {
  max-width: 1200px !important;
}
`;
    fs.writeFileSync(cssFile, css, 'utf8');
}
console.log('Farmer pages CSS patched!');
