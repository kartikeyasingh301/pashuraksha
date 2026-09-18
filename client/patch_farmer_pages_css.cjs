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
    // Replace const cardStyle
    code = code.replace(
        'const cardStyle = { background:"white", borderRadius:"14px", padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", marginBottom:"12px" };',
        ''
    );
    // Replace <div style={cardStyle}>
    code = code.replace(
        /<div style=\{cardStyle\}>/g,
        '<div className="card">'
    );
    // Replace style={{...cardStyle,...}}
    code = code.replace(
        /style=\{\{\s*\.\.\.cardStyle, /g,
        'className="card" style={{ '
    );
    
    // Buttons
    code = code.replace(
        'style={{ display:"flex", alignItems:"center", gap:"6px", background:"#2E7D32", color:"white", border:"none", padding:"8px 14px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}',
        'className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "13px", width: "auto" }}'
    );
    
    code = code.replace(
        'style={{ display:"flex", alignItems:"center", gap:"6px", background:"transparent", color:"#1976D2", border:"none", fontWeight:"600", cursor:"pointer", padding:"8px 0" }}',
        'className="btn" style={{ padding: "8px 0", color: "#1976D2", background: "transparent", width: "auto" }}'
    );
    return code;
});

// 2. Patch VaccinationPassbook.jsx
patchFile('src/pages/farmer/VaccinationPassbook.jsx', (code) => {
    // It currently uses <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
    code = code.replace(
        /<div style=\{\{\s*background:\s*'white',\s*borderRadius:\s*'14px',\s*padding:\s*'20px',\s*boxShadow:\s*'0 2px 8px rgba\(0,0,0,0\.07\)',\s*marginBottom:\s*'20px'\s*\}\}>/g,
        '<div className="card">'
    );
    code = code.replace(
        /<div style=\{\{\s*background:\s*'white',\s*borderRadius:\s*'12px',\s*padding:\s*'16px',\s*marginBottom:\s*'12px',\s*border:\s*'1px solid #eee',\s*boxShadow:\s*'0 2px 8px rgba\(0,0,0,0\.04\)'\s*\}\}>/g,
        '<div className="card">'
    );
    // Buttons
    code = code.replace(
        'style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc", background: "white", fontWeight: "600", color: "#333", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}',
        'className="btn" style={{ flex: 1, background: "white", color: "#333", border: "1px solid #ccc" }}'
    );
    code = code.replace(
        'style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#E8F5E9", color: "#2E7D32", fontWeight: "600", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}',
        'className="btn" style={{ flex: 1, background: "#E8F5E9", color: "#2E7D32" }}'
    );
    
    return code;
});

console.log("Patched Farmer CSS classes");
