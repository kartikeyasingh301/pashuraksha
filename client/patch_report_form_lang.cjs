const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the headerControls declaration with an empty fragment to remove the redundant selector
code = code.replace(
    /const headerControls = \([\s\S]*?\);\s*return \(/,
    "return ("
);

// Oh wait, is `headerControls` used inside the return? Let's check
fs.writeFileSync(file, code);
console.log("ReportForm patched");
