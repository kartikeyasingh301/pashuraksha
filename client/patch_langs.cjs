const fs = require('fs');

const files = [
  'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx',
  'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx',
  'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Advisory.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Add import if not present
    if (!code.includes('useLanguage')) {
      code = code.replace(/import { useState[^}]*\} from ["']react["'];/, match => match + "\nimport { useLanguage } from '../../hooks/useLanguage.js';");
    }
    
    // Replace useState("en") with useLanguage()
    code = code.replace(/const \[lang, setLang\] = useState\(["']en["']\);/g, "const [lang, setLang] = useLanguage();");
    
    fs.writeFileSync(file, code);
  }
});

console.log("Language patched");
