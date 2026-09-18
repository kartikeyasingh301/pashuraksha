const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('showMissedCall')) {
    code = code.replace(
        "const [showIVR, setShowIVR] = useState(false);",
        "const [showIVR, setShowIVR] = useState(false);\n  const [showMissedCall, setShowMissedCall] = useState(false);"
    );
}

const helplineBlock = `
        {/* Helpline Section */}
        <section style={{ marginTop: "24px", marginBottom: "24px" }}>
          <div style={{ background: "#F5F5F5", borderRadius: "14px", padding: "20px", border: "1px solid #E0E0E0" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "800", color: "#333", display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={20} color="#1B5E20" /> Pashuraksha Helpline
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#666" }}>No internet? Report by phone.</p>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#1B5E20", marginBottom: "16px", letterSpacing: "1px" }}>1800-XXX-XXXX</div>
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <button onClick={() => setShowIVR(true)} className="btn btn-outline" style={{ background: "white" }}>
                [IVR DEMO]
              </button>
              <button onClick={() => setShowMissedCall(true)} className="btn" style={{ background: "#333", color: "white" }}>
                [MISSED CALL DEMO]
              </button>
            </div>
          </div>
        </section>
        
        {showIVR && <IVRSimulation onClose={() => setShowIVR(false)} isMissedCall={false} />}
        {showMissedCall && <IVRSimulation onClose={() => setShowMissedCall(false)} isMissedCall={true} />}
`;

if (!code.includes('Pashuraksha Helpline')) {
    code = code.replace(
        "      </div>\n    </Layout>",
        helplineBlock + "\n      </div>\n    </Layout>"
    );
}

if (!code.includes('Phone, BookOpen')) {
    code = code.replace(
        "import { Plus, BookOpen, Clock, AlertCircle } from \"lucide-react\";",
        "import { Plus, BookOpen, Clock, AlertCircle, Phone } from \"lucide-react\";"
    );
}

fs.writeFileSync(file, code, 'utf8');
console.log("Farmer Dashboard IVR and Missed Call Demo patched!");
