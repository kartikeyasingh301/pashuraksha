const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/contexts/AuthContext.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Optimistic unlock for instant load')) {
    code = code.replace(
        "setToken(storedToken);",
        "setToken(storedToken);\n\n      // Optimistic unlock for instant load (UX win)\n      setLoading(false);"
    );
    
    fs.writeFileSync(file, code, 'utf8');
    console.log("AuthContext optimized for instant load!");
}
