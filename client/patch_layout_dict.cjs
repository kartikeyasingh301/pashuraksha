const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/Layout.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/if \(enText === '\{translate\('MAIN MENU'\)\}'\)/g, "if (enText === 'MAIN MENU')");
code = code.replace(/if \(enText === '\{translate\('HELP & SETTINGS'\)\}'\)/g, "if (enText === 'HELP & SETTINGS')");

fs.writeFileSync(file, code);
console.log("Dictionary fixed");
