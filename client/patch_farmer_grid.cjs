const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Add dashboard-content class and desktop grid wrapper
code = code.replace(
  /<div className="page-content" style=\{\{ paddingBottom:"80px" \}\}>/,
  `<div className="page-content dashboard-content" style={{ paddingBottom:"80px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div className="farmer-desktop-grid">
          <div className="farmer-main-col">`
);

// 2. Split the grid right before "Quick Tips"
code = code.replace(
  /\{\/\*\s*Quick Tips\s*\*\/\}/,
  `</div>
          <div className="farmer-side-col">
          {/* Quick Tips */}`
);

// 3. Close the grid and side col before closing the page-content
code = code.replace(
  /<\/div>\s*<\/Layout>/,
  `          </div>
        </div>
      </div>
    </Layout>`
);

fs.writeFileSync(file, code, 'utf8');
console.log('Dashboard properly gridded!');
