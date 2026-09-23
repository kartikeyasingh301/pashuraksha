const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/LeafletMap.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "<MapContainer center={[19.5, 75.0]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={false}>",
  "<MapContainer center={[19.5, 75.0]} zoom={6} style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }} zoomControl={false}>"
);

fs.writeFileSync(file, code);
console.log("LeafletMap fixed 2");
