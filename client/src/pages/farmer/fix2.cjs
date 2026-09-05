const fs = require('fs');
let content = fs.readFileSync('Advisory.jsx', 'utf8');

content = content.replace("import Layout from '../../components/Layout.jsx';", "import Layout from '../../components/Layout.jsx';\nimport { Shield, Target, AlertTriangle, Skull, Activity, PhoneCall } from 'lucide-react';");

content = content.replace("icon: '??'", "icon: <Shield size={32} color=\"#2E7D32\" />");
content = content.replace("icon: '??'", "icon: <Target size={32} color=\"#1565C0\" />");
content = content.replace("icon: '??'", "icon: <Activity size={32} color=\"#E65100\" />");
content = content.replace("icon: '??'", "icon: <AlertTriangle size={32} color=\"#C62828\" />");
content = content.replace("icon: '???'", "icon: <Shield size={32} color=\"#2E7D32\" />");
content = content.replace("?? Emergency Contact", "<PhoneCall size={20} /> Emergency Contact");

fs.writeFileSync('Advisory.jsx', content);
