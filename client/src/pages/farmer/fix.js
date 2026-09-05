const fs = require('fs');
let content = fs.readFileSync('ReportForm.jsx', 'utf8');

// Insert import
content = content.replace("import { useState, useCallback } from 'react';", "import { useState, useCallback } from 'react';\nimport { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send } from 'lucide-react';");

content = content.replace('<span>??</span>', '<WifiOff size={16} />');
content = content.replace('<span>?', '<span style={{display:"flex",alignItems:"center",gap:"4px"}}><CheckCircle size={16}/> ');
content = content.replace('<span>??', '<span style={{display:"flex",alignItems:"center",gap:"4px"}}><Save size={16}/> ');
content = content.replace('<span>??', '<span style={{display:"flex",alignItems:"center",gap:"4px"}}><AlertTriangle size={16}/> ');
content = content.replace('? Getting location...', '<Loader size={16} className="spin" /> Getting location...');
content = content.replace('?? Get GPS Location', '<MapPin size={16} /> Get GPS Location');
content = content.replace('? Lat:', '<CheckCircle size={16}/> Lat:');
content = content.replace('?? Submit Report', '<Send size={16}/> Submit Report');
content = content.replace('?? Save Offline', '<Save size={16}/> Save Offline');

fs.writeFileSync('ReportForm.jsx', content);
