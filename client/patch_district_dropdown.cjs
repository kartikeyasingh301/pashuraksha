const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/DistrictDashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Add state for selectedDistrict
code = code.replace(
  "const [time, setTime] = useState('');",
  "const [time, setTime] = useState('');\n  const [selectedDistrict, setSelectedDistrict] = useState('Pune');"
);

// 2. Districts list (add inside the component or outside)
const districtsList = `const MAHARASHTRA_DISTRICTS = [
  'Pune', 'Nashik', 'Ahilyanagar', 'Nagpur', 'Mumbai', 'Thane', 'Kolhapur', 'Solapur', 'Satara', 'Jalgaon', 'Amravati', 'Aurangabad'
];\n\nexport default function DistrictDashboard() {`;

code = code.replace("export default function DistrictDashboard() {", districtsList);

// 3. Replace the static title with a beautiful dropdown
const headerReplacement = `<div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <select 
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  refreshData();
                }}
                style={{ 
                  margin: 0, fontSize: "20px", fontWeight: "800", color: "#1B5E20", 
                  border: "none", background: "transparent", outline: "none", cursor: "pointer",
                  WebkitAppearance: "none", paddingRight: "16px",
                  backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231B5E20%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')",
                  backgroundRepeat: "no-repeat", backgroundPosition: "right center"
                }}
              >
                {MAHARASHTRA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d} District Analytics</option>
                ))}
              </select>
            </div>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#666", fontWeight: "600" }}>Maharashtra Veterinary Command</p>
          </div>`;

code = code.replace(
  /<div>\s*<h1[^>]*>Pune District Analytics<\/h1>\s*<p[^>]*>Maharashtra Zone 4 Command<\/p>\s*<\/div>/,
  headerReplacement
);

// We need to make the data change slightly when the district changes to make it look real.
code = code.replace(
  "const refreshData = () => {",
  "const refreshData = () => {\n    setLoading(true);\n    // Randomize mock data slightly for demo\n    MOCK_CHART_DATA.forEach(d => d.cases = Math.floor(Math.random() * 40) + 5);\n    MOCK_SPECIES_DATA.forEach(d => d.value = Math.floor(Math.random() * 500) + 100);"
);

// If the replace failed because of whitespace, let's do a fallback generic replace:
if (!code.includes('MAHARASHTRA_DISTRICTS')) {
    console.error("Failed to patch DistrictDashboard!");
} else {
    fs.writeFileSync(file, code, 'utf8');
    console.log("Successfully patched DistrictDashboard with dropdown!");
}
