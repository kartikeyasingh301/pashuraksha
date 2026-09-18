const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Layout.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import \{ useEffect \} from 'react';\n/g, '');
if (!code.includes('import React, { useState, useEffect }')) {
  code = code.replace(/import React, \{ useState \} from 'react';/g, "import React, { useState, useEffect } from 'react';");
}

fs.writeFileSync(file, code, 'utf8');
