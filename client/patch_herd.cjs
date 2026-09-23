const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/HerdLedger.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /{a\.species === 'Cattle' \? '.*?' : a\.species === 'Buffalo' \? '.*?' : a\.species === 'Sheep' \? '.*?' : a\.species === 'Goat' \? '.*?' : a\.species\[0\]}/g,
  "{a.species[0]}"
);

fs.writeFileSync(file, code);
console.log("HerdLedger.jsx patched");
