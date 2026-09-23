const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add ChevronRight to lucide-react imports
code = code.replace(
  /ClipboardList, MapPin, BookOpen, Languages, Thermometer, Syringe, ShieldAlert, Phone, FileText/g,
  "ClipboardList, MapPin, BookOpen, Languages, Thermometer, Syringe, ShieldAlert, Phone, FileText, ChevronRight"
);

// Add ChevronRight icon to the three action cards
code = code.replace(
  /<div style={{ fontSize:"11px", color:"#888" }}>4 animals due by Oct 2026<\/div>\s*<\/div>/g,
  `<div style={{ fontSize:"11px", color:"#888" }}>4 animals due by Oct 2026</div>
                </div>
                <ChevronRight size={18} color="#F57F17" />`
);

code = code.replace(
  /<div style={{ fontSize:"11px", color:"#888" }}>MH-NK-4821 under observation<\/div>\s*<\/div>/g,
  `<div style={{ fontSize:"11px", color:"#888" }}>MH-NK-4821 under observation</div>
                </div>
                <ChevronRight size={18} color="#1565C0" />`
);

code = code.replace(
  /<div style={{ fontSize:"11px", color:"#888" }}>Elevated risk near your area<\/div>\s*<\/div>/g,
  `<div style={{ fontSize:"11px", color:"#888" }}>Elevated risk near your area</div>
                </div>
                <ChevronRight size={18} color="#C62828" />`
);

fs.writeFileSync(file, code);
console.log("Dashboard upcoming actions visually patched");
