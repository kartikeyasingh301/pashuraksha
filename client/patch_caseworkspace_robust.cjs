const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

// The header div closes before {/* TIMELINE */}
code = code.replace(
  /\{\/\*\s*TIMELINE\s*\*\/\}/,
  `<div className="desktop-grid">\n<div className="main-col">\n{/* TIMELINE */}`
);

// Split right before {/* WHY FLAGGED */}
code = code.replace(
  /\{\/\*\s*WHY FLAGGED\s*\*\/\}/,
  `</div>\n<div className="side-col">\n{/* WHY FLAGGED */}`
);

// Find the last index of </Layout>
const lastIndex = code.lastIndexOf('</Layout>');
// We know it looks like `      </div>\n    </Layout>` or similar.
// Actually, just find the last `</div>` before the last `</Layout>`.
let beforeLayout = code.substring(0, lastIndex);
let lastDivIndex = beforeLayout.lastIndexOf('</div>');
let newBeforeLayout = beforeLayout.substring(0, lastDivIndex) + '</div>\n</div>\n</div>\n' + beforeLayout.substring(lastDivIndex + 6);

code = newBeforeLayout + '</Layout>' + code.substring(lastIndex + 9);

fs.writeFileSync(file, code, 'utf8');
console.log('CaseWorkspace gridded robustly!');
