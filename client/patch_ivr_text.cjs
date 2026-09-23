const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/IVRSimulation.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('SIMULATED FOR SIH PROTOTYPE')) {
    code = code.replace(
      'PASHURAKSHA HELPLINE</div>',
      'PASHURAKSHA HELPLINE</div>\n          <div style={{ color: "#F57C00", fontSize: "10px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>SIMULATED FOR SIH PROTOTYPE</div>'
    );
    fs.writeFileSync(file, code, 'utf8');
}
console.log("Patched IVR text");
