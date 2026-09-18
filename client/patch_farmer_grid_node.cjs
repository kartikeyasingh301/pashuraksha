const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Replace opening page-content
code = code.replace(
  /<div className="page-content" style=\{\{ paddingBottom:"80px" \}\}>/,
  `<div className="page-content dashboard-content" style={{ paddingBottom:"80px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div className="farmer-desktop-grid">
          <div className="farmer-main-col">`
);

// 2. Split
code = code.replace(
  /\{\/\* Quick Tips \*\/\}/,
  `</div>
          <div className="farmer-side-col">
          {/* Quick Tips */}`
);

// 3. Replace the EXACT last div and Layout
const lastPart = `      </div>\n    </Layout>`;
const newLastPart = `          </div>\n        </div>\n      </div>\n    </Layout>`;
code = code.replace(lastPart, newLastPart);

fs.writeFileSync(file, code, 'utf8');
console.log('Done!');
