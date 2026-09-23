const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/server/routes/reports.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);",
  "const report = db.prepare('SELECT * FROM reports WHERE id = ? OR local_id = ?').get(req.params.id, req.params.id);"
);

fs.writeFileSync(file, code);
console.log("reports.js patched");
