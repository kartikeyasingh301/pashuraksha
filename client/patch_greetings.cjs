const fs = require('fs');
const path = require('path');

function replaceAll(filePath, target, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    code = code.replace(target, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

const target1 = /import \{ formatKolkataTime, getKolkataTime \} from '\.\.\/\.\.\/utils\/time\.js';/g;
const replacement1 = `import { formatKolkataTime, getKolkataHour } from '../../utils/time.js';`;

const target2 = /const hour = getKolkataTime\(\)\.getHours\(\);/g;
const replacement2 = `const hour = getKolkataHour();`;

// For Farmer Dashboard
replaceAll('pages/farmer/Dashboard.jsx', target1, replacement1);
replaceAll('pages/farmer/Dashboard.jsx', target2, replacement2);

// For Vet Dashboard
replaceAll('pages/vet/Dashboard.jsx', target1, replacement1);
replaceAll('pages/vet/Dashboard.jsx', target2, replacement2);

console.log("Greetings patched");
