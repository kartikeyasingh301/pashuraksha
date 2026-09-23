const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.html') || full.endsWith('.css')) {
            let content = fs.readFileSync(full, 'utf8');
            let modified = false;
            
            if (content.includes('\uFFFD')) {
                content = content.replace(/\uFFFD/g, '-');
                modified = true;
            }
            if (content.includes('&bull;')) {
                content = content.replace(/&bull;/g, '-');
                modified = true;
            }
            if (content.includes('\u2022')) {
                content = content.replace(/\u2022/g, '-');
                modified = true;
            }
            
            if (modified) {
                fs.writeFileSync(full, content, 'utf8');
                console.log("Patched Unicode in: " + full);
            }
        }
    }
}
walk(path.join(__dirname, 'src'));
