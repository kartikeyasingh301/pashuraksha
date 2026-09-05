const fs = require('fs');
let content = fs.readFileSync('ResponseQueue.jsx', 'utf8');

content = content.replace("import { apiGet, apiPost } from '../../api/client.js';", "import { apiGet, apiPost } from '../../api/client.js';\nimport { CheckCircle, MapPin } from 'lucide-react';");
content = content.replace("<div className='empty-icon'>?</div>", "<div className='empty-icon'><CheckCircle size={48} color=\"#9E9E9E\" /></div>");
content = content.replace("<div className='case-location'>??", "<div className='case-location'><MapPin size={16} style={{display:'inline',marginRight:'4px',verticalAlign:'middle'}}/>");

fs.writeFileSync('ResponseQueue.jsx', content);
