const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'src/App.jsx');
let appCode = fs.readFileSync(appFile, 'utf8');

if(!appCode.includes('CaseWorkspace')) {
    appCode = appCode.replace(
        "import ResponseQueue from './pages/vet/ResponseQueue.jsx';",
        "import ResponseQueue from './pages/vet/ResponseQueue.jsx';\nimport CaseWorkspace from './pages/vet/CaseWorkspace.jsx';"
    );
    appCode = appCode.replace(
        "<Route path='/vet/queue' element={<PrivateRoute role='vet'><ResponseQueue /></PrivateRoute>} />",
        "<Route path='/vet/queue' element={<PrivateRoute role='vet'><ResponseQueue /></PrivateRoute>} />\n      <Route path='/vet/case/:id' element={<PrivateRoute role='vet'><CaseWorkspace /></PrivateRoute>} />"
    );
    fs.writeFileSync(appFile, appCode, 'utf8');
}
console.log("App.jsx patched with CaseWorkspace route.");
