const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/VaccinationPassbook.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const filteredRecords = filter === 'all' ? records : records.filter(r => r.status === filter);",
  `const filteredRecords = (filter === 'all' ? records : records.filter(r => r.status === filter)).sort((a, b) => {
      const order = { 'overdue': 1, 'due_soon': 2, 'vaccinated': 3 };
      return order[a.status] - order[b.status];
    });`
);

fs.writeFileSync(file, code);
console.log("Passbook sorting patched");
