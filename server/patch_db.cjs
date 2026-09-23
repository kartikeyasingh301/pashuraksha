const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/server/db/database.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "insUser.run(1, 'farmer1', bcrypt.hashSync('farmer123', 10), 'farmer', 'Raju Kumar', 'Nashik');",
  "insUser.run(1, 'farmer1', bcrypt.hashSync('farmer123', 10), 'farmer', 'Raju Kumar', 'Nashik');\n    insUser.run(3, 'farmer2', bcrypt.hashSync('farmer123', 10), 'farmer', 'Suresh Patel', 'Pune');"
);

fs.writeFileSync(file, code);
console.log("database.js patched");
