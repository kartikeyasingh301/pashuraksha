const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Login.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('longLoading')) {
    code = code.replace(
        "const [loading, setLoading] = useState(false);",
        "const [loading, setLoading] = useState(false);\n  const [longLoading, setLongLoading] = useState(false);"
    );
    
    code = code.replace(
        "setLoading(true);",
        "setLoading(true);\n    const timer = setTimeout(() => setLongLoading(true), 4000);"
    );
    
    code = code.replace(
        "setLoading(false);",
        "clearTimeout(timer);\n      setLongLoading(false);\n      setLoading(false);"
    );
    
    code = code.replace(
        "{loading ? 'Signing in...' : 'SIGN IN'}",
        "{loading ? (longLoading ? 'Waking up secure server...' : 'Signing in...') : 'SIGN IN'}"
    );

    fs.writeFileSync(file, code, 'utf8');
    console.log("Login.jsx patched with longLoading state.");
}
