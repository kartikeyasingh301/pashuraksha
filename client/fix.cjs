const fs = require('fs');
const file = 'src/pages/farmer/VaccinationPassbook.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /background: 'none',\s+border: 'none',\s+color: '#2E7D32',\s+fontSize: '13px',\s+fontWeight: '600',\s+cursor: 'pointer',\s+padding: 0/g;
const replacement = "background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', fontSize: '13px', fontWeight: '700', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px'";

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
