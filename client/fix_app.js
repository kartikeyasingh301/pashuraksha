import fs from 'fs';
let file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('<BrowserRouter>', '<BrowserRouter>\n      <ScrollToTop />');
fs.writeFileSync(file, content);
