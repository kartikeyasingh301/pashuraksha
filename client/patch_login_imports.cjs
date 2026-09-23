const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Login.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    "import { Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';",
    "import { Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, User, Stethoscope } from 'lucide-react';"
);

fs.writeFileSync(file, code, 'utf8');
console.log('Login imports fixed!');
