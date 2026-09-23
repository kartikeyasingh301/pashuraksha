const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/govt/GovtCommandCenter.jsx');
if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/State/g, 'Maharashtra');
    code = code.replace(/STATE/g, 'MAHARASHTRA');
    code = code.replace(/Pashuraksha Command Center/g, 'MAHARASHTRA ANIMAL HEALTH SURVEILLANCE');
    fs.writeFileSync(file, code, 'utf8');
    console.log("Govt Command Center patched!");
} else {
    console.log("GovtCommandCenter not found, creating a minimal one if needed?");
}
