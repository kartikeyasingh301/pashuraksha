const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Advisory.jsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('useLanguage')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useLanguage } from '../../hooks/useLanguage.js';");
}

fs.writeFileSync(file, code);
console.log("Advisory patched");
