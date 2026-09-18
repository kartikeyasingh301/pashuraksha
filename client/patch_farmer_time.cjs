const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { getKolkataTime }")) {
    code = `import { getKolkataTime } from '../../utils/time.js';\n` + code;
}
code = code.replace(/const hour = new Date\(\)\.getHours\(\);/g, `const hour = getKolkataTime().getHours();`);

fs.writeFileSync(file, code, 'utf8');
console.log("Time patched");
