const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

const oldTipsUI = `<div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {t.tips.map((tip, i) => (
                <div key={i} style={{
                  background:"white", borderRadius:"12px", padding:"14px",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                  display:"flex", flexDirection:"column", gap:"8px",
                  border:"1px solid #f0f0f0"
                }}>
                  <div>{TIP_ICONS[tip.icon]}</div>
                  <p style={{ margin:0, fontSize:"13px", color:"#444", lineHeight:"1.4", fontWeight:"500" }}>{tip.text}</p>
                </div>
              ))}
            </div>`;

const newTipsUI = `<div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {t.tips.map((tip, i) => (
                <div key={i} style={{
                  background:"#F1F8E9", borderRadius:"8px", padding:"12px 14px",
                  display:"flex", alignItems:"flex-start", gap:"12px",
                  borderLeft:"4px solid #8BC34A"
                }}>
                  <div style={{ marginTop:"2px", opacity: 0.8 }}>{TIP_ICONS[tip.icon]}</div>
                  <p style={{ margin:0, fontSize:"13.5px", color:"#333", lineHeight:"1.4", fontWeight:"500" }}>{tip.text}</p>
                </div>
              ))}
            </div>`;

code = code.replace(oldTipsUI, newTipsUI);

fs.writeFileSync(file, code);
console.log("Dashboard tips UI patched");
