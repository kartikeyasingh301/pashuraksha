const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/VaccinationPassbook.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<button\s*key=\{f\.id\}\s*onClick=\{\(\) => setFilter\(f\.id\)\}\s*style=\{\{[\s\S]*?\}\}\s*>\s*\{f\.label\}\s*<\/button>/g,
  `<button key={f.id} onClick={() => setFilter(f.id)} className={"chip " + (filter === f.id ? "active" : "")}>{f.label}</button>`
);

code = code.replace(
  /style=\{\{\s*background:\s*'white',\s*borderRadius:\s*'14px',\s*padding:\s*'16px',\s*boxShadow:\s*'0 2px 8px rgba\(0,0,0,0\.07\)',\s*borderLeft:\s*`4px solid \$\{styleConfig\.color\}`\s*\}\}/g,
  `className="card" style={{ borderLeftColor: styleConfig.color }}`
);

code = code.replace(
  /<button style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'6px',\s*background:\s*'transparent',\s*border:\s*'none',\s*color:\s*'#1B5E20',\s*fontWeight:\s*'600',\s*cursor:\s*'pointer'\s*\}\}>/g,
  `<button className="btn btn-tertiary">`
);

fs.writeFileSync(file, code, 'utf8');
