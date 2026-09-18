const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/CaseWorkspace.jsx');
let code = fs.readFileSync(file, 'utf8');

// Replace top declaration
code = code.replace(
    "const [callState, setCallState] = useState(null);",
    "const [callState, setCallState] = useState(0);"
);

// Remove the inline declaration I added
code = code.replace(
    "const [callState, setCallState] = useState(0); // 0=none, 1=dialing, 2=calling, 3=connected, 4=logged\n",
    ""
);

fs.writeFileSync(file, code, 'utf8');
console.log("CaseWorkspace callState duplicate fixed!");
