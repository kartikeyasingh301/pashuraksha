import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import LeafletMap from '../../components/LeafletMap.jsx';
import { apiGet } from '../../api/client.js';

const FILTERS = ['All', 'FMD', 'PPR', 'Anthrax', 'Lumpy Skin Disease', 'Other'];
const LEGEND = [
  { color: '#757575', label: 'Report' },
  { color: '#1976D2', label: 'Case' },
  { color: '#F57F17', label: 'Cluster' },
  { color: '#C62828', label: 'Suspected Outbreak' },
];

export default function MapView() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const data = await apiGet('/map/incidents');
        setIncidents(data.features || data.incidents || data || []);
      } catch (err) { setError(err.message || 'Failed to load map data'); }
      finally { setLoading(false); }
    }
    fetchIncidents();
  }, []);

  const filtered = filter === 'All' ? incidents : incidents.filter((f) => {
    const syn = f.properties?.syndrome || f.syndrome || '';
    return filter === 'Other' ? !['FMD','PPR','Anthrax','Lumpy Skin Disease'].includes(syn) : syn === filter;
  });

  useEffect(() => {
    const main = document.querySelector('.app-main');
    if (main) {
      main.style.paddingTop = '0';
      main.style.paddingLeft = '0';
      main.style.paddingRight = '0';
      if (window.innerWidth >= 1024) {
        main.style.paddingBottom = '0';
      }
      main.style.maxWidth = '100%';
      main.style.display = 'flex';
      main.style.flexDirection = 'column';
    }
    return () => {
      if (main) {
        main.style.paddingTop = '';
        main.style.paddingLeft = '';
        main.style.paddingRight = '';
        main.style.paddingBottom = '';
        main.style.maxWidth = '';
        main.style.display = '';
        main.style.flexDirection = '';
      }
    };
  }, []);

  return (
    <Layout title='Map View' showBack>
      <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', background: '#e5e7eb' }}>
        
        {/* Floating Glassmorphism Filters */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 1000, display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', padding: '6px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.4)' }}>
            {FILTERS.map((f) => (
              <button 
                key={f} 
                className={'filter-btn' + (filter === f ? ' filter-btn-active' : '')} 
                onClick={() => setFilter(f)}
                style={{ borderRadius: '8px', border: filter === f ? 'none' : '1px solid #e2e8f0', background: filter === f ? 'var(--brand-600)' : 'transparent', fontWeight: '700' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <div className='alert alert-error' style={{ margin: '80px 16px 16px 16px' }}>{error}</div>}
        
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ color: 'var(--brand-600)', fontWeight: '700', background: 'white', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Loading map intelligence...</div>
          </div>
        ) : !navigator.onLine ? (
          <div className="card" style={{ margin: '80px 16px 16px 16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '600' }}>Live map is unavailable offline.</div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {filtered.map((f, i) => (
                 <div key={i} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <strong>{f.syndrome || f.disease}</strong> - {f.village || f.district} <em>({f.status})</em>
                 </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <LeafletMap incidents={filtered} height='100%' filterStatus={filter !== 'All' && filter !== 'Other' ? undefined : undefined} />
            <div className='map-legend' style={{ bottom: '24px', left: '16px', background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className='legend-title' style={{ fontSize: '14px', fontWeight: '800', color: '#333', marginBottom: '12px' }}>Map Legend</div>
              {LEGEND.map((item) => (
                <div key={item.label} className='legend-item' style={{ fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '8px' }}>
                  <span className='legend-dot' style={{ background: item.color, width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0 }} />
                  <span className='legend-label'>{item.label}</span>
                </div>
              ))}
              <div className='legend-count' style={{ fontWeight: '700', fontSize: '12px', color: '#1B5E20', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                {filtered.length} visible on map
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

