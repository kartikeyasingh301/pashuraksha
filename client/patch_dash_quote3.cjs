const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /sub: "आज तुमचे प्राणी कसे आहेत•,/,
  'sub: "आज तुमचे प्राणी कसे आहेत?",'
);

fs.writeFileSync(file, code);
console.log("Marathi dashboard quote patched");
