const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/DistrictDashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    "Rajkot District Analytics",
    "Pune District Analytics"
);

code = code.replace(
    "Gujarat Zone 4 Command",
    "Maharashtra Zone 4 Command"
);

fs.writeFileSync(file, code, 'utf8');
console.log("Fixed Gujarat -> Maharashtra in DistrictDashboard.jsx!");
