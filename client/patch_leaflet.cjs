const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/LeafletMap.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "<div style={{ height, width: '100%', borderRadius: 'var(--radius-card)', overflow: 'hidden', position: 'relative' }}>",
  "<div style={{ height: height === '100%' ? undefined : height, flex: height === '100%' ? 1 : 'none', width: '100%', borderRadius: 'var(--radius-card)', overflow: 'hidden', position: 'relative' }}>"
);

fs.writeFileSync(file, code);
console.log("LeafletMap fixed");
