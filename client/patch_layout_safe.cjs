const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/Layout.jsx');
let code = fs.readFileSync(file, 'utf8');

const target = `{lang && setLang && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', gap: '4px' }}>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <option value="en" style={{color:'black'}}>English</option>
                  <option value="hi" style={{color:'black'}}>Hindi</option>
                  <option value="mr" style={{color:'black'}}>Marathi</option>
                </select>
              </div>
            )}`;

code = code.replace(target, '');

fs.writeFileSync(file, code, 'utf8');
console.log('Layout patched safely');
