const fs = require('fs');
const path = require('path');

function patchFile(relPath, replacer) {
    const file = path.join(__dirname, relPath);
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    code = replacer(code);
    fs.writeFileSync(file, code, 'utf8');
}

// 1. Patch HerdLedger.jsx
patchFile('src/pages/farmer/HerdLedger.jsx', (code) => {
    code = code.replace(/Rajkot/g, 'Nashik');
    code = code.replace(/Gondal/g, 'Malegaon');
    code = code.replace(/Upleta/g, 'Satana');
    code = code.replace(/Dhoraji/g, 'Baglan');
    code = code.replace(/GJ-RJ-/g, 'MH-NK-');
    return code;
});

// 2. Patch VaccinationPassbook.jsx
patchFile('src/pages/farmer/VaccinationPassbook.jsx', (code) => {
    code = code.replace(/GJ-RJ-/g, 'MH-NK-');
    return code;
});

// 3. Patch MapView.jsx
patchFile('src/pages/vet/MapView.jsx', (code) => {
    code = code.replace(/Rajkot/g, 'Nashik');
    code = code.replace(/22\.3039/g, '20.5522');
    code = code.replace(/70\.8022/g, '74.5244');
    return code;
});

console.log("UI components patched for Maharashtra!");
