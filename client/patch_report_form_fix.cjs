const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/pages/farmer/ReportForm.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`        </form>
           </>
        )`,
`        </form>
           </>
        )}`
);

fs.writeFileSync(file, code, 'utf8');
console.log("Fixed JSX syntax in ReportForm.jsx");
