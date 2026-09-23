const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import \{ v4 as uuidv4 \} from "uuid";/g, '');
code = code.replace(/local_id: uuidv4\(\),/g, 'local_id: `${user?.id}_${Date.now()}_${form.species}_${form.village.trim()}`,');

fs.writeFileSync(file, code, 'utf8');
