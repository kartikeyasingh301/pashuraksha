const fs = require('fs');
const path = require('path');

function patchFile(relPath, replacer) {
    const file = path.join(__dirname, relPath);
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    code = replacer(code);
    fs.writeFileSync(file, code, 'utf8');
}

patchFile('src/pages/vet/Dashboard.jsx', (code) => {
    let out = code.replace(
        "id: o.id, type: 'OUTBREAK',",
        "id: o.case_id || o.id, type: 'OUTBREAK',"
    );
    return out;
});

patchFile('src/pages/vet/CriticalAlerts.jsx', (code) => {
    let out = code.replace(
        "navigate(`/vet/case/${id}`)",
        "navigate(`/vet/case/${id}`)"
    );
    out = out.replace(
        "onAction(item.id)",
        "onAction(item.case_id || item.id)"
    );
    // There are multiple button onAction(item.id) in CriticalAlerts
    out = out.replace(
        /onAction\(item\.id\)/g,
        "onAction(item.case_id || item.id)"
    );
    return out;
});

patchFile('src/pages/vet/ResponseQueue.jsx', (code) => {
    let out = code.replace(
        /navigate\(`\/vet\/case\/\$\{item\.id\}`\)/g,
        "navigate(`/vet/case/${item.case_id || item.id}`)"
    );
    return out;
});

console.log("Patched case ID routing!");
