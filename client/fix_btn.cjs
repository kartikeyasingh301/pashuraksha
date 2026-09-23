const fs = require('fs');
let file = 'src/pages/farmer/VaccinationPassbook.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/background: 'none',[ \t\r\n]+border: 'none',[ \t\r\n]+color: '#2E7D32',[ \t\r\n]+fontSize: '13px',[ \t\r\n]+fontWeight: '600',[ \t\r\n]+cursor: 'pointer',[ \t\r\n]+padding: 0/, \ackground: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', fontSize: '13px', fontWeight: '700', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px'\);
fs.writeFileSync(file, content);
