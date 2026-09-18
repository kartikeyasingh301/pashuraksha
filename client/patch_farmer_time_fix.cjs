const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/farmer/Dashboard.jsx');
let code = fs.readFileSync(file, 'utf8');

// Fix the broken import - getKolkataTime doesn't exist, it's formatKolkataTime
code = code.replace(
    "import { getKolkataTime } from '../../utils/time.js';",
    "import { getKolkataHour, formatKolkataTime } from '../../utils/time.js';"
);

// Fix any usage of getKolkataTime() to formatKolkataTime()
code = code.replace(/getKolkataTime\(\)/g, 'formatKolkataTime()');

// Fix date formatting in reports to use IST-aware formatter
code = code.replace(
    /new Date\(report\.capturedAt \|\| report\.captured_at\)\.toLocaleDateString\("en-IN"\)/g,
    'formatKolkataTime(report.capturedAt || report.captured_at)'
);

fs.writeFileSync(file, code, 'utf8');
console.log('Farmer Dashboard time fix applied!');
