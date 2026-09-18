const fs = require('fs');
const path = require('path');

function replaceAllInFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    code = code.replace(regex, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

// CaseWorkspace.jsx - "Call Farmer" button
replaceAllInFile('pages/vet/CaseWorkspace.jsx',
  /<button onClick=\{\(\) => setSimulateCall\(true\)\}\s*style=\{\{\s*width:\s*"100%",\s*padding:\s*"12px",\s*background:\s*"var\(--brand-600\)",\s*color:\s*"white",\s*border:\s*"none",\s*borderRadius:\s*"var\(--radius-btn\)",\s*fontWeight:\s*"700",\s*cursor:\s*"pointer",\s*display:\s*"flex",\s*justifyContent:\s*"center",\s*alignItems:\s*"center",\s*gap:\s*"8px"\s*\}\}>/g,
  `<button onClick={() => setSimulateCall(true)} className="btn btn-primary btn-block">`
);

// ResponseQueue.jsx - Action buttons
replaceAllInFile('pages/vet/ResponseQueue.jsx',
  /<div style=\{\{\s*display:\s*"flex",\s*gap:\s*"8px",\s*marginTop:\s*"16px"\s*\}\}>\s*<button style=\{\{\s*flex:\s*1,\s*padding:\s*"10px",\s*background:\s*"#2E7D32",\s*color:\s*"white",\s*border:\s*"none",\s*borderRadius:\s*"6px",\s*fontWeight:\s*"600",\s*cursor:\s*"pointer"\s*\}\} onClick=\{\(\) => handleAction\(item\.id, 'START'\)\}>/g,
  `<div className="action-row">\n<button className="btn btn-primary" onClick={() => handleAction(item.id, 'START')}>`
);
replaceAllInFile('pages/vet/ResponseQueue.jsx',
  /<button style=\{\{\s*flex:\s*1,\s*padding:\s*"10px",\s*background:\s*"#E8F5E9",\s*color:\s*"#2E7D32",\s*border:\s*"none",\s*borderRadius:\s*"6px",\s*fontWeight:\s*"600",\s*cursor:\s*"pointer"\s*\}\} onClick=\{\(\) => handleAction\(item\.id, 'RESOLVE'\)\}>/g,
  `<button className="btn btn-secondary" onClick={() => handleAction(item.id, 'RESOLVE')}>`
);
replaceAllInFile('pages/vet/ResponseQueue.jsx',
  /<button style=\{\{\s*padding:\s*"10px 16px",\s*background:\s*"#F5F5F5",\s*color:\s*"#555",\s*border:\s*"none",\s*borderRadius:\s*"6px",\s*fontWeight:\s*"600",\s*cursor:\s*"pointer"\s*\}\}>/g,
  `<button className="btn btn-tertiary">`
);

// Remove specific inline styles from buttons in CriticalAlerts
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /<button onClick=\{\(\) => openModal\(item\)\}\s*style=\{\{\s*width:\s*"100%",\s*padding:\s*"10px",\s*background:\s*"white",\s*color:\s*"#2E7D32",\s*border:\s*"1px solid #2E7D32",\s*borderRadius:\s*"8px",\s*fontWeight:\s*"700",\s*cursor:\s*"pointer",\s*display:\s*"flex",\s*justifyContent:\s*"center",\s*alignItems:\s*"center",\s*gap:\s*"8px"\s*\}\}>/g,
  `<button onClick={() => openModal(item)} className="btn btn-secondary btn-block">`
);

// Apply Skeleton to CriticalAlerts and ResponseQueue if loading
replaceAllInFile('pages/vet/CriticalAlerts.jsx',
  /if \(loading\) return <Layout title="Critical Alerts"><div style=\{\{padding: '20px'\}\}>Loading alerts\.\.\.<\/div><\/Layout>;/g,
  `if (loading) return <Layout title="Critical Alerts"><div style={{padding: '20px'}}><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text" style={{height:'100px'}}></div><div className="skeleton skeleton-text" style={{height:'100px'}}></div></div></Layout>;`
);
replaceAllInFile('pages/vet/ResponseQueue.jsx',
  /if \(loading\) return <Layout title="Response Queue"><div style=\{\{padding: '20px'\}\}>Loading queue\.\.\.<\/div><\/Layout>;/g,
  `if (loading) return <Layout title="Response Queue"><div style={{padding: '20px'}}><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text" style={{height:'100px'}}></div><div className="skeleton skeleton-text" style={{height:'100px'}}></div></div></Layout>;`
);

console.log("Vet components patched.");
