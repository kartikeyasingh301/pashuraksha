const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportDetail.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { db } from '../../db/db.js';",
  "import db from '../../db/dexie.js';"
);

code = code.replace(
  "const localReport = await db.reports.get(id);",
  "const localReport = await db.reports.get(id);"
);

code = code.replace(
  "const byLocalId = await db.reports.where('local_id').equals(id).first();",
  "const byLocalId = await db.offlineQueue.where('localId').equals(id).first();"
);

fs.writeFileSync(file, code);
console.log("ReportDetail.jsx patched");
