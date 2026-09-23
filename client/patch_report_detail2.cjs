const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportDetail.jsx';
let code = fs.readFileSync(file, 'utf8');

// The file currently has: {report.status || (report.synced ? "REPORT" : "PENDING SYNC")}
// We will replace that line with a helper function

const helperStr = `
  const getTranslatedStatus = (status) => {
    if (!status) return t.statusPending || "PENDING SYNC";
    const st = status.toUpperCase();
    if (lang === 'hi') {
      if (st === 'REPORT') return 'रिपोर्ट दर्ज';
      if (st === 'CASE') return 'सत्यापित मामला';
      if (st === 'CLUSTER') return 'गंभीर मामला';
      if (st === 'SUSPECTED' || st === 'SUSPECTED_OUTBREAK') return 'संभावित प्रकोप';
      if (st === 'COMPLETED') return 'पूरा हुआ';
    }
    if (lang === 'mr') {
      if (st === 'REPORT') return 'अहवाल नोंदवला';
      if (st === 'CASE') return 'सत्यापित प्रकरण';
      if (st === 'CLUSTER') return 'गंभीर प्रकरण';
      if (st === 'SUSPECTED' || st === 'SUSPECTED_OUTBREAK') return 'संभाव्य प्रादुर्भाव';
      if (st === 'COMPLETED') return 'पूर्ण झाले';
    }
    return st;
  };
`;

code = code.replace("  const getStatusColor", helperStr + "\n  const getStatusColor");

code = code.replace(
  '{report.status || (report.synced ? "REPORT" : "PENDING SYNC")}',
  '{getTranslatedStatus(report.status)}'
);

fs.writeFileSync(file, code);
console.log("ReportDetail translated patched");
