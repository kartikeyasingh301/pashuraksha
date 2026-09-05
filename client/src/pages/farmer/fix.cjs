const fs = require('fs');
let content = fs.readFileSync('Dashboard.jsx', 'utf8');
content = content.replace("import { getReports } from '../../db/db.js';", "");
fs.writeFileSync('Dashboard.jsx', content);
