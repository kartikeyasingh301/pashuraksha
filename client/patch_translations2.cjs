const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('lblVaccine: "Vaccination Status",', 'lblVaccine: "Has this animal been vaccinated?",');
code = code.replace('lblNotes: "Additional Notes (optional)",', 'lblNotes: "Any other details? (optional)",');

fs.writeFileSync(file, code);
console.log("Translations fixed 2");
