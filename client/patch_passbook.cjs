const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/VaccinationPassbook.jsx';
let code = fs.readFileSync(file, 'utf8');

// Update coverage
code = code.replace(/78%/g, "85%");

// Update counts in header
code = code.replace(/Vaccinated: 21/g, "Vaccinated: 17");
code = code.replace(/Due Soon: 4/g, "Due Soon: 2");
code = code.replace(/Overdue: 2/g, "Overdue: 1");

// Update counts in filters
code = code.replace(/All \(27\)/g, "All (20)");
code = code.replace(/Vaccinated \(21\)/g, "Vaccinated (17)");
code = code.replace(/Due Soon \(4\)/g, "Due Soon (2)");
code = code.replace(/Overdue \(2\)/g, "Overdue (1)");

// Update the red alert banner
code = code.replace(/2 vaccination\(s\) overdue/g, "1 vaccination(s) overdue");

fs.writeFileSync(file, code);
console.log("Passbook patched");
