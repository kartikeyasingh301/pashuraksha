const fs = require('fs');
const path = require('path');

const formatFn = `
function formatSLA(hours) {
  if (hours === undefined || hours === null) return "SLA: Not set";
  if (hours < 0) return \`SLA BREACHED (\${Math.abs(hours)}h overdue)\`;
  if (hours < 12) return \`SLA AT RISK (\${hours}h remaining)\`;
  return \`SLA ON TRACK (\${hours}h remaining)\`;
}
`;

function patchSLA(relPath) {
    const file = path.join(__dirname, relPath);
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    if (!code.includes('formatSLA')) {
        code = code.replace(
            "import { apiGet",
            `${formatFn}\nimport { apiGet`
        );
    }
    
    code = code.replace(
        /SLA: \{item\.sentinel\?\.sla_hours_remaining\}h \(\{item\.sentinel\?\.sla_state\}\)/g,
        "{formatSLA(item.sentinel?.sla_hours_remaining)}"
    );
    // Also patch static ones if any
    code = code.replace(
        /SLA: 01:24 remaining/g,
        "SLA AT RISK (01:24 remaining)"
    );

    fs.writeFileSync(file, code, 'utf8');
}

patchSLA('src/pages/vet/ResponseQueue.jsx');
patchSLA('src/pages/vet/CriticalAlerts.jsx');
patchSLA('src/pages/vet/CaseWorkspace.jsx');

console.log("SLA text formats patched!");
