const fs = require('fs');
const path = require('path');

const timeFile = path.join(__dirname, 'src/utils/time.js');
const timeCode = `
export function getKolkataHour() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hourCycle: 'h23'
  });
  return parseInt(formatter.format(new Date()), 10);
}

export function formatKolkataTime(dateString, lang = 'en-IN') {
  const d = dateString ? new Date(dateString) : new Date();
  return new Intl.DateTimeFormat(lang, {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(d);
}

export function getGreeting() {
  const hr = getKolkataHour();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}
`;
if (!fs.existsSync(path.dirname(timeFile))) { fs.mkdirSync(path.dirname(timeFile), { recursive: true }); }
fs.writeFileSync(timeFile, timeCode, 'utf8');

const dashFile = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let dashCode = fs.readFileSync(dashFile, 'utf8');

if (!dashCode.includes('getKolkataHour')) {
    dashCode = dashCode.replace(
        'import { useNavigate } from "react-router-dom";',
        'import { useNavigate } from "react-router-dom";\nimport { getKolkataHour, formatKolkataTime } from "../../utils/time.js";'
    );
    dashCode = dashCode.replace(
        'const hour = new Date().getHours();',
        'const hour = getKolkataHour();'
    );
    dashCode = dashCode.replace(
        /new Date\(report\.capturedAt \|\| report\.captured_at\)\.toLocaleDateString\("en-IN"\)/g,
        'formatKolkataTime(report.capturedAt || report.captured_at)'
    );
    fs.writeFileSync(dashFile, dashCode, 'utf8');
}
console.log('Farmer time patched on UX branch!');
