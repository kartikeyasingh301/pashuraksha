const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/App.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('ErrorBoundary')) {
    code = code.replace(
        "import AuthProvider from './contexts/AuthContext.jsx';",
        "import AuthProvider from './contexts/AuthContext.jsx';\nimport ErrorBoundary from './components/ErrorBoundary.jsx';"
    );
    
    code = code.replace(
        "<AuthProvider>",
        "<ErrorBoundary>\n    <AuthProvider>"
    );
    
    code = code.replace(
        "</AuthProvider>",
        "</AuthProvider>\n    </ErrorBoundary>"
    );

    fs.writeFileSync(file, code, 'utf8');
    console.log("Patched App.jsx with ErrorBoundary");
}
