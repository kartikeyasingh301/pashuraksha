const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

code += `\n/* Map Overrides */\n.desaturated-tiles { filter: grayscale(100%) opacity(80%) sepia(10%) hue-rotate(90deg); }\n`;
code = code.replace(
  /\.map-legend\s*\{.*?\}/,
  `.map-legend { position: absolute; bottom: 30px; left: 16px; right: auto; background: var(--surface); border-radius: var(--radius-card); padding: 12px; box-shadow: var(--shadow-sm); z-index: 1000; min-width: 120px; border: 1px solid var(--border); }`
);

fs.writeFileSync(file, code, 'utf8');
