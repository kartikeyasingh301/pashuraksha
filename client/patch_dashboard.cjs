const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// The original file probably has ? or some weird ascii
code = code.replace(
  'Check body temp daily ?" normal is 38?"39.5AC',
  'Check body temp daily (normal is 38-39.5 C)'
);
code = code.replace(
  'Check body temp daily ?" normal is 38?"39.5AC',
  'Check body temp daily (normal is 38-39.5 C)'
);

// wait let's use regex
code = code.replace(/Check body temp daily.*?C/, "Check body temp daily - normal is 38-39.5 °C");

fs.writeFileSync(file, code);
console.log("Dashboard fixed");
