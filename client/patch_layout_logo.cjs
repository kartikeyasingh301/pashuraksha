const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Layout.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    "import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Stethoscope, LogOut } from 'lucide-react';",
    "import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, LogOut } from 'lucide-react';\nimport Logo from './Logo.jsx';"
);

code = code.replace(
    /<span className="header-logo"><Stethoscope size=\{28\} color="#2E7D32" \/><\/span>/g,
    '<span className="header-logo"><Logo size={28} color="white" /></span>'
);

fs.writeFileSync(file, code, 'utf8');
console.log("Layout.jsx logo patched!");
