const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.css');
let code = fs.readFileSync(file, 'utf8');

const css = `
/* Phase 3: Shell & Layouts */
.layout-farmer {
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  background: var(--bg);
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.layout-vet {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.vet-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .layout-vet {
    flex-direction: row;
    background: var(--bg);
  }
  .vet-sidebar {
    display: flex;
    flex-direction: column;
    width: 240px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    height: 100vh;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .sidebar-brand {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-nav {
    flex: 1;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius-btn);
    color: var(--text-secondary);
    font-weight: 600;
    transition: all 0.2s;
  }
  .sidebar-nav-item:hover {
    background: var(--brand-50);
    color: var(--brand-700);
  }
  .sidebar-nav-item.active {
    background: var(--brand-50);
    color: var(--brand-600);
  }
  .sidebar-footer {
    padding: 24px;
    border-top: 1px solid var(--border);
  }
  .sidebar-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-btn);
    color: var(--danger-text);
    font-weight: 600;
    justify-content: center;
    transition: background 0.2s;
  }
  .sidebar-logout:hover {
    background: var(--danger-bg);
  }
  .layout-vet .app-header {
    display: none; /* Hide mobile header for vet on desktop */
  }
  .layout-vet .bottom-nav {
    display: none; /* Hide bottom nav for vet on desktop */
  }
  .layout-vet .app-main {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 32px;
  }
}
`;

code += css;
fs.writeFileSync(file, code, 'utf8');
