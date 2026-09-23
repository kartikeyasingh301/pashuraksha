const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /sub: "आज आपके पशु कैसे हैं•,/,
  'sub: "आज आपके पशु कैसे हैं?",'
);

code = code.replace(
  /sub: "तुमचे प्राणी आज कसे आहेत•,/,
  'sub: "तुमचे प्राणी आज कसे आहेत?",'
);

fs.writeFileSync(file, code);
console.log("All dashboard quotes patched");
