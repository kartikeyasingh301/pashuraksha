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

  return (
    <Layout title='Map View' showBack>
      <div className='map-page'>
        <div className='map-filter-row'>
          {FILTERS.map((f) => (
            <button key={f} className={'filter-btn' + (filter === f ? ' filter-btn-active' : '')} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {error && <div className='alert alert-error'>{error}</div>}
        {loading ? <div className='loading-state'>Loading map data...</div> : (
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
        )}
      </div>
    </Layout>
  );
}
