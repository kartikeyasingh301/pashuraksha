const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/Layout.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Power, CheckCircle, WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';",
  "import { Home, ClipboardList, BookOpen, LayoutDashboard, AlertTriangle, Map as MapIcon, Power, CheckCircle, WifiOff, RefreshCw, ArrowLeft, Menu, X, FileText, Syringe, Info, Heart } from 'lucide-react';"
);

fs.writeFileSync(file, code);
console.log("Layout imports patched");
