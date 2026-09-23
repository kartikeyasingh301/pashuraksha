const fs = require('fs');
const path = require('path');

const dashFile = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(dashFile, 'utf8');

// Replace the content wrapper with the responsive grid wrapper
code = code.replace(
  /<div className="page-content" style=\{\{ paddingBottom:"80px" \}\}>/,
  `<div className="page-content" style={{ paddingBottom:"80px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      <div className="farmer-desktop-grid">
        <div className="farmer-main-col">`
);

// We need to close the main col and open the side col before "Quick Tips" or "Recent Reports"
code = code.replace(
  /{[/]\* Quick Tips \*[/]}/,
  `</div>
        <div className="farmer-side-col">
        {/* Quick Tips */}`
);

// We need to close the side col and the grid at the end
code = code.replace(
  /<\/div>\s*<\/Layout>/,
  `  </div>
      </div>
    </div>
    </Layout>`
);

fs.writeFileSync(dashFile, code, 'utf8');
console.log('Dashboard layout patched!');
