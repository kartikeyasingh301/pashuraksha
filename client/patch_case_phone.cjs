const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Phone,')) {
    code = code.replace(
        "import { ShieldAlert, MapPin, Activity, CheckCircle, Clock, ChevronRight, FileText, FlaskConical, Users, Crosshair } from 'lucide-react';",
        "import { ShieldAlert, MapPin, Activity, CheckCircle, Clock, ChevronRight, FileText, FlaskConical, Users, Crosshair, Phone } from 'lucide-react';"
    );
    fs.writeFileSync(file, code, 'utf8');
    console.log("Fixed missing Phone import in CaseWorkspace!");
}
