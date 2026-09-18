const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/vet/MapView.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\{loading \? <div className='loading-state'>Loading map data\.\.\.<\/div> : \([\s\S]*?\)\}/,
  `{loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
            <div className="skeleton" style={{ width: '100%', height: 'calc(100vh - 260px)', borderRadius: 'var(--radius-card)' }}></div>
          </div>
        ) : !navigator.onLine ? (
          <div className="card" style={{ margin: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Map tiles are unavailable while offline.</div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {filtered.map((f, i) => (
                 <div key={i} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <strong>{f.syndrome || f.disease}</strong> - {f.village || f.district} <em>({f.status})</em>
                 </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='map-container-wrapper'>
            <LeafletMap incidents={filtered} height='calc(100vh - 260px)' />
            <div className='map-legend'>
              <div className='legend-title'>Legend</div>
              {LEGEND.map((item) => (
                <div key={item.label} className='legend-item'>
                  <span className='legend-dot' style={{ background: item.color }} />
                  <span className='legend-label'>{item.label}</span>
                </div>
              ))}
              <div className='legend-count'>{filtered.length} incidents</div>
            </div>
          </div>
        )}`
);

fs.writeFileSync(file, code, 'utf8');
