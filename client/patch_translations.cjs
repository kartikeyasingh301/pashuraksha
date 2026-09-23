const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the english dictionary values with the farmer-friendly ones!
code = code.replace('lblSyndrome: "Syndrome / Condition *",', 'lblSyndrome: "Main Disease/Problem *",');
code = code.replace('lblHerdSize: "Herd Size",', 'lblHerdSize: "Total Animals (Herd Size)",');
code = code.replace('lblMortality: "Mortality Count",', 'lblMortality: "How many animals died? (if any)",');
code = code.replace('lblAnimalId: "Animal / Herd ID (optional)",', 'lblAnimalId: "Animal ID/Tag (optional)",');
code = code.replace('lblGps: "GPS Location",', 'lblGps: "Farm Location",');

fs.writeFileSync(file, code);
console.log("Translations fixed");
