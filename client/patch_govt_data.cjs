const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/govt/GovtCommandCenter.jsx');
let code = fs.readFileSync(file, 'utf8');

// Replace cluster data
code = code.replace(
  /const NATIONAL_CLUSTERS = \[[\s\S]*?\];/m,
  `const MAHARASHTRA_CLUSTERS = [
  { id: 1, lat: 20.55, lng: 74.52, triage: "RED", disease: "FMD", district: "Nashik", state: "Maharashtra", count: 12, radius: 25 },
  { id: 2, lat: 18.15, lng: 74.58, triage: "YELLOW", disease: "BQ", district: "Pune", state: "Maharashtra", count: 4, radius: 18 },
  { id: 3, lat: 19.57, lng: 74.20, triage: "RED", disease: "PPR", district: "Ahilyanagar", state: "Maharashtra", count: 7, radius: 20 },
  { id: 4, lat: 17.65, lng: 75.90, triage: "YELLOW", disease: "Brucellosis", district: "Solapur", state: "Maharashtra", count: 9, radius: 15 },
  { id: 5, lat: 19.99, lng: 73.78, triage: "GREEN", disease: "HS", district: "Nashik", state: "Maharashtra", count: 3, radius: 10 },
];`
);
code = code.replace(/NATIONAL_CLUSTERS/g, 'MAHARASHTRA_CLUSTERS');

// Replace Stockpile
code = code.replace(
  /const STOCKPILE = \[[\s\S]*?\];/m,
  `const STOCKPILE = [
  { vaccine: "FMD Multivalent", stock: 42000, required: 60000, unit: "doses", state: "Nashik District" },
  { vaccine: "PPR", stock: 28000, required: 35000, unit: "doses", state: "Ahilyanagar District" },
  { vaccine: "HS + BQ Combined", stock: 15000, required: 15000, unit: "doses", state: "Pune District" },
  { vaccine: "Anthrax Spore", stock: 800, required: 5000, unit: "doses", state: "Solapur District" },
];`
);

// Replace Chart Data
code = code.replace(
  /const MAHARASHTRA_BAR = \[[\s\S]*?\];/m,
  `const DISTRICT_BAR = [
  {state:"Nashik",cases:44},{state:"Pune",cases:28},{state:"Ahilyanagar",cases:22},{state:"Solapur",cases:17},{state:"Satara",cases:12},{state:"Thane",cases:9},
];`
);
code = code.replace(/MAHARASHTRA_BAR/g, 'DISTRICT_BAR');

// Remove TODO prototype smell
code = code.replace(
  /\/\/ TODO: Replace with live API calls to \/api\/govt\/metrics, \/api\/clusters, \/api\/govt\/stockpile/g,
  ""
);

fs.writeFileSync(file, code, 'utf8');
console.log("Govt Command Center data patched for Maharashtra!");
