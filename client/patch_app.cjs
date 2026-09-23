const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/App.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import ReportDetail from './pages/farmer/ReportDetail.jsx';",
  "import ReportDetail from './pages/farmer/ReportDetail.jsx';\nimport About from './pages/farmer/About.jsx';"
);

code = code.replace(
  "<Route path='/farmer/passbook' element={<PrivateRoute role='farmer'><VaccinationPassbook /></PrivateRoute>} />",
  "<Route path='/farmer/passbook' element={<PrivateRoute role='farmer'><VaccinationPassbook /></PrivateRoute>} />\n        <Route path='/farmer/about' element={<PrivateRoute role='farmer'><About /></PrivateRoute>} />"
);

fs.writeFileSync(file, code);
console.log("App routing patched");
