const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/index.css';
let code = fs.readFileSync(file, 'utf8');

const drawerCss = `
/* HAMBURGER MENU DRAWER */
.drawer-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  transition: opacity 0.3s ease;
}
.drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 280px;
  background: white;
  z-index: 10000;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
}
.drawer.open {
  transform: translateX(0);
}
.drawer-header {
  padding: 24px 20px;
  background: var(--brand-700);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-links {
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
}
.drawer-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-left: 4px solid transparent;
}
.drawer-link:active {
  background: #f5f5f5;
}
.drawer-link.active {
  background: #E8F5E9;
  color: var(--brand-700);
  border-left: 4px solid var(--brand-600);
  font-weight: 700;
}
.hamburger-btn {
  background: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-right: 12px;
  cursor: pointer;
}
`;

code += "\n" + drawerCss;
fs.writeFileSync(file, code);
console.log("Drawer CSS patched");
