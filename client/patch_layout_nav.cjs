const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Layout.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /className="bottom-nav-item"\s*style=\{\(\{ isActive \}\) =>[\s\S]*?\}\s*>/,
  `className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
            end={item.to === '/farmer' || item.to === '/vet'}
            aria-current={({ isActive }) => isActive ? "page" : undefined}
          >`
);

code = code.replace(
  /<span className="nav-icon">\{item\.icon\}<\/span>/,
  `{({ isActive }) => (
              <>
                <span className="nav-icon">
                  {React.cloneElement(item.icon, { fill: isActive ? "currentColor" : "none", strokeWidth: isActive ? 2 : 2 })}
                </span>
                <span className="nav-label">{item.label}</span>
              </>
            )}`
);

// We need to import React if we use React.cloneElement
if (!code.includes("import React")) {
    code = `import React from 'react';\n` + code;
}

// Remove the old nav-label span
code = code.replace(/<span className="nav-label">\{item\.label\}<\/span>\s*<\/NavLink>/, "</NavLink>");

fs.writeFileSync(file, code, 'utf8');

// Update CSS for nav
const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');
css = css + `
.bottom-nav-item.active {
  color: var(--brand-600);
  border-top: 3px solid var(--brand-600);
}
.bottom-nav-item {
  border-top: 3px solid transparent;
}
`;
fs.writeFileSync(cssFile, css, 'utf8');

console.log("Nav patched!");
