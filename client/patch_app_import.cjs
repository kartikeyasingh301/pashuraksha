const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/App.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import ErrorBoundary')) {
    code = code.replace(
        "import GovtCommandCenter from './pages/govt/GovtCommandCenter.jsx';",
        "import GovtCommandCenter from './pages/govt/GovtCommandCenter.jsx';\nimport ErrorBoundary from './components/ErrorBoundary.jsx';"
    );
    fs.writeFileSync(file, code, 'utf8');
    console.log("ErrorBoundary import added.");
}
