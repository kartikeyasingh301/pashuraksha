const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/Layout.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/LogOut/g, 'Power');

fs.writeFileSync(file, code);
console.log("Layout patched with Power icon");
