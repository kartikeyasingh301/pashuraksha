const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/HerdLedger.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const SUMMARY = { total: 27, healthy: 24, observation: 2, vacDue: 4 };",
  "const SUMMARY = { total: 10, healthy: 8, observation: 2, vacDue: 2 };"
);

fs.writeFileSync(file, code);
console.log("Herd summary patched");
