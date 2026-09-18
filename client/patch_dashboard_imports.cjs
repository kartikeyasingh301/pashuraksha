const fs = require('fs');
const path = require('path');

function fixImports(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('import { getGreeting }')) {
    code = code.replace(/import \{ getGreeting \} from '\.\.\/\.\.\/utils\/time\.js';/g, '');
    code = `import { getGreeting } from '../../utils/time.js';\n` + code;
  }
  if (code.includes('import { getKolkataTime }')) {
    code = code.replace(/import \{ getKolkataTime \} from '\.\.\/\.\.\/utils\/time\.js';/g, '');
    code = `import { getKolkataTime } from '../../utils/time.js';\n` + code;
  }
  fs.writeFileSync(file, code, 'utf8');
}

fixImports(path.join(__dirname, 'src/pages/vet/Dashboard.jsx'));
fixImports(path.join(__dirname, 'src/pages/farmer/Dashboard.jsx'));
console.log("Imports fixed!");
