const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);"
);

code = code.replace(
  "console.error(e);",
  "console.error(e);\n        setError(e.message || 'Case details could not be loaded.');"
);

const newErrorState = `
  if (loading) return <Layout title="Case Workspace" showBack><div style={{ padding: "80px 40px", textAlign: "center", color: "#666" }}><Activity size={48} color="#ccc" className="spin-anim" style={{ marginBottom: "16px" }}/><br/>Loading Case Intelligence...</div></Layout>;
  if (error) return <Layout title="Case Workspace" showBack><div style={{ padding: "80px 40px", textAlign: "center", color: "#D32F2F" }}><ShieldAlert size={48} color="#FFCDD2" style={{ marginBottom: "16px" }}/><br/>{error}<br/><br/><button onClick={() => navigate(-1)} className="btn btn-outline">Go Back</button></div></Layout>;
  if (!data || !data.case) return <Layout title="Case Workspace" showBack><div style={{ padding: "80px 40px", textAlign: "center", color: "#666" }}><FileText size={48} color="#e0e0e0" style={{ marginBottom: "16px" }}/><br/>Case {id} could not be found.<br/><br/><button onClick={() => navigate(-1)} className="btn btn-outline">Back to Queue</button></div></Layout>;
`;

code = code.replace(
  "if (loading) return <Layout title=\"Case Workspace\" showBack><div style={{ padding: \"40px\", textAlign: \"center\" }}>Loading Case Intelligence...</div></Layout>;\n  if (!data || !data.case) return <Layout title=\"Case Workspace\" showBack><div style={{ padding: \"40px\", textAlign: \"center\" }}>Case not found.</div></Layout>;",
  newErrorState
);

fs.writeFileSync(file, code, 'utf8');
console.log("Patched CaseWorkspace error states");
