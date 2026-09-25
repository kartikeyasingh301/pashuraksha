const fs = require('fs');
let code = fs.readFileSync('client/src/pages/vet/Dashboard.jsx', 'utf8');

// Fix 1: High Risk double-count - Case 101 is counted in both Critical (via outbreak) and High Risk
// We need to exclude cases already in the critical set from high risk
code = code.replace(
  /setSummary\(\{\s*\n\s*totalReports: reports\.length,\s*\n\s*critical: new Set\(\[\.\.\.outbreaks\.map\(o => o\.case_id \|\| o\.id\), \.\.\.cases\.filter\(c => c\.sentinel\?\.risk_level === 'CRITICAL'\)\.map\(c => c\.id\)\]\)\.size,\s*\n\s*highRisk: cases\.filter\(c => c\.sentinel\?\.risk_level === 'HIGH'\)\.length,/,
  `const criticalIds = new Set([...outbreaks.map(o => o.case_id || o.id), ...cases.filter(c => c.sentinel?.risk_level === 'CRITICAL').map(c => c.id)]);
        setSummary({
          totalReports: reports.length,
          critical: criticalIds.size,
          highRisk: cases.filter(c => c.sentinel?.risk_level === 'HIGH' && !criticalIds.has(c.id)).length,`
);

fs.writeFileSync('client/src/pages/vet/Dashboard.jsx', code);
console.log('Fixed double-count');
