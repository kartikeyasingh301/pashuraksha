const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/LabStatus.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\{loading \? <div className='loading-state'>Loading lab results\.\.\.<\/div> : samples\.length === 0 \? \(/,
  `{loading ? (
    <div style={{ padding: '20px' }}>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text" style={{ height: '80px' }}></div>
      <div className="skeleton skeleton-text" style={{ height: '80px' }}></div>
    </div>
  ) : samples.length === 0 ? (`
);

fs.writeFileSync(file, code, 'utf8');
