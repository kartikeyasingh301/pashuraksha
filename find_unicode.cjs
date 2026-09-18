const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.html') || full.endsWith('.css')) {
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('\uFFFD')) {
                console.log("Found replacement character in: " + full);
            }
        }
    }
}
walk(path.join(__dirname, 'client/src'));
