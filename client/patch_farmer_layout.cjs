const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');

css = css.replace(
  /\.layout-farmer\s*\{\s*max-width:\s*480px;\s*margin:\s*0 auto;\s*position:\s*relative;\s*background:\s*var\(--bg\);\s*box-shadow:\s*0 0 20px rgba\(0,0,0,0\.05\);\s*min-height:\s*100vh;\s*display:\s*flex;\s*flex-direction:\s*column;\s*\}/,
  `.layout-farmer {
    width: 100%;
    margin: 0 auto;
    position: relative;
    background: var(--bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .farmer-desktop-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  @media (min-width: 1024px) {
    .farmer-desktop-grid {
      grid-template-columns: 2fr 1fr;
      align-items: start;
    }
  }`
);

fs.writeFileSync(cssFile, css, 'utf8');
console.log('CSS layout-farmer patched!');
