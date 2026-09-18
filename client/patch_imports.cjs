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

replaceAll('pages/farmer/Dashboard.jsx', /import \{ formatKolkataTime, getKolkataTime \} from '\.\.\/\.\.\/utils\/time\.js';/g, "import { formatKolkataTime, getKolkataHour } from '../../utils/time.js';");
replaceAll('pages/vet/Dashboard.jsx', /import \{ formatKolkataTime, getKolkataTime \} from '\.\.\/\.\.\/utils\/time\.js';/g, "import { formatKolkataTime, getKolkataHour } from '../../utils/time.js';");

console.log("Imports fixed");
