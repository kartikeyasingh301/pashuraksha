const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/components/Layout.jsx';
let code = fs.readFileSync(file, 'utf8');

const dict = `
  const translate = (enText) => {
    if (lang === 'hi') {
      if (enText === 'MAIN MENU') return 'मुख्य मेनू';
      if (enText === 'Dashboard') return 'डैशबोर्ड';
      if (enText === 'Report Health Issue') return 'बीमारी की रिपोर्ट करें';
      if (enText === 'My Herd Ledger') return 'मेरा पशु लेजर';
      if (enText === 'Vaccine Passbook') return 'टीकाकरण पासबुक';
      if (enText === 'Health Advisories') return 'स्वास्थ्य सलाह';
      if (enText === 'HELP & SETTINGS') return 'सहायता एवं सेटिंग्स';
      if (enText === 'About PashuSuraksha') return 'पशुसुरक्षा के बारे में';
    }
    if (lang === 'mr') {
      if (enText === 'MAIN MENU') return 'मुख्य मेनू';
      if (enText === 'Dashboard') return 'डॅशबोर्ड';
      if (enText === 'Report Health Issue') return 'आजाराची नोंद करा';
      if (enText === 'My Herd Ledger') return 'माझे पशु खाते';
      if (enText === 'Vaccine Passbook') return 'लसीकरण पासबुक';
      if (enText === 'Health Advisories') return 'आरोग्य सल्ला';
      if (enText === 'HELP & SETTINGS') return 'मदत आणि सेटिंग्ज';
      if (enText === 'About PashuSuraksha') return 'पशुसुरक्षा बद्दल';
    }
    return enText;
  };
`;

code = code.replace(
  "const navItems = role === 'vet' ? VET_NAV : FARMER_NAV;",
  "const navItems = role === 'vet' ? VET_NAV : FARMER_NAV;\n" + dict
);

// Replace hardcoded english in drawer links
code = code.replace("MAIN MENU", "{translate('MAIN MENU')}");
code = code.replace(" Dashboard", " {translate('Dashboard')}");
code = code.replace(" Report Health Issue", " {translate('Report Health Issue')}");
code = code.replace(" My Herd Ledger", " {translate('My Herd Ledger')}");
code = code.replace(" Vaccine Passbook", " {translate('Vaccine Passbook')}");
code = code.replace(" Health Advisories", " {translate('Health Advisories')}");
code = code.replace("HELP & SETTINGS", "{translate('HELP & SETTINGS')}");
code = code.replace(" About PashuSuraksha", " {translate('About PashuSuraksha')}");

fs.writeFileSync(file, code);
console.log("Layout translations patched");
