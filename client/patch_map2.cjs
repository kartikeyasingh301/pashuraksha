const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/vet/MapView.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "<div style={{ flex: 1, position: 'relative' }}>",
  "<div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>"
);

// wait, LeafletMap receives height='100%', which maps to `<div style={{ height }}>`. If parent is flex column, and height is 100%, does it work? Yes. Or we can pass `flex: 1` if it accepted styles. 
// LeafletMap accepts height. Let's make it '100%'. It is '100%'. 

fs.writeFileSync(file, code);
console.log("Map fixed 2");
