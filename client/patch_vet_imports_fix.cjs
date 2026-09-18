const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    "import { AlertTriangle, Activity, Map as MapIcon, Dna, Timer, ShieldAlert, ChevronRight, FileText, CheckCircle, BarChart2 } from 'lucide-react';",
    "import { AlertTriangle, Activity, Map as MapIcon, Dna, Timer, ShieldAlert, ChevronRight, FileText, CheckCircle, BarChart2, FlaskConical, MapPin } from 'lucide-react';"
);

fs.writeFileSync(file, code, 'utf8');
console.log('Vet Dashboard imports fixed!');
