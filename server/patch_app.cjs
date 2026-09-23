const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/server/app.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const outbreaksRouter   = require('./routes/outbreaks');",
  "const outbreaksRouter   = require('./routes/outbreaks');\nconst chatRouter        = require('./routes/chat');"
);

code = code.replace(
  "app.use('/api/outbreaks',   outbreaksRouter);",
  "app.use('/api/outbreaks',   outbreaksRouter);\napp.use('/api/chat',        chatRouter);"
);

fs.writeFileSync(file, code);
console.log("App.js patched");
