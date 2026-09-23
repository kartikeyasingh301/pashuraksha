const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/vet/MapView.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "height: '100%'",
  "flex: 1"
);

fs.writeFileSync(file, code);
console.log("Map fixed");
