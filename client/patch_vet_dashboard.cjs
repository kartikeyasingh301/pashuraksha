const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// Replace arbitrary button style with btn btn-secondary
code = code.replace(
  /<button onClick=\{\(\) => navigate\(item\.route\)\}\s*style=\{\{\s*width:\s*"100%",\s*padding:\s*"12px",\s*background:\s*"white",\s*color:\s*"#1B5E20",\s*border:\s*"2px solid #1B5E20",\s*borderRadius:\s*"8px",\s*fontWeight:\s*"700",\s*cursor:\s*"pointer",\s*display:\s*"flex",\s*justifyContent:\s*"center",\s*alignItems:\s*"center",\s*gap:\s*"8px"\s*\}\}>/g,
  `<button onClick={() => navigate(item.route)} className="btn btn-secondary btn-block">`
);

// Fix the icon mapping
code = code.replace(/<MapIcon size=\{14\}\/> \{item\.location\}/g, `{item.type === 'LAB' ? <FlaskConical size={14}/> : <MapPin size={14}/>} {item.location}`);

// Make sure FlaskConical and MapPin are imported
if (!code.includes('FlaskConical')) {
    code = code.replace(/import \{.*?\} from ['"]lucide-react['"];/, (match) => match.replace('}', ', FlaskConical }'));
}
if (!code.includes('MapPin')) {
    code = code.replace(/import \{.*?\} from ['"]lucide-react['"];/, (match) => match.replace('}', ', MapPin }'));
}
// Remove MapIcon if it's unused elsewhere, or just leave it.

fs.writeFileSync(file, code, 'utf8');
