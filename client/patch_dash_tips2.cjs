const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>[\s\S]*?<\/div>\s*<\/section>/;

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
            </div>
          </section>`;

code = code.replace(regex, newTipsUI);

fs.writeFileSync(file, code);
console.log("Dashboard tips UI patched FOR REAL");
