const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

// The header div closes before {/* TIMELINE */}
// I will split right before {/* TIMELINE */}
code = code.replace(
  /\{\/\*\s*TIMELINE\s*\*\/\}/,
  `<div className="desktop-grid">\n<div className="main-col">\n{/* TIMELINE */}`
);

// I will split right before {/* WHY FLAGGED */}
code = code.replace(
  /\{\/\*\s*WHY FLAGGED\s*\*\/\}/,
  `</div>\n<div className="side-col">\n{/* WHY FLAGGED */}`
);

// The page-content div closes right before </Layout>
code = code.replace(
  /<\/div>\s*<\/Layout>/,
  `</div>\n</div>\n</div>\n</Layout>`
);

fs.writeFileSync(file, code, 'utf8');
console.log('CaseWorkspace gridded!');
