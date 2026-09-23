const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/App.jsx');
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import SplashScreen')) {
    code = code.replace(
        "import ErrorBoundary from './components/ErrorBoundary.jsx';",
        "import ErrorBoundary from './components/ErrorBoundary.jsx';\nimport SplashScreen from './components/SplashScreen.jsx';"
    );
}

code = code.replace(
    /return <div className='full-loading'>Loading\.\.\.<\/div>;/g,
    "return <SplashScreen />;"
);

fs.writeFileSync(file, code, 'utf8');
console.log("App.jsx updated with SplashScreen.");
