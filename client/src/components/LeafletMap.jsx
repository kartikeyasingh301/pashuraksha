import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatKolkataTime } from '../utils/time.js';

const STATUS_COLORS = {
  REPORT: 'var(--text-secondary)',
  CASE: 'var(--info-text)',
  CLUSTER: 'var(--warning-text)',
  SUSPECTED_OUTBREAK: 'var(--danger-text)',
  CONFIRMED: 'var(--danger-text)',
  RESPONSE: 'var(--cat-3)',
};

function getColor(status) { return STATUS_COLORS[status] || 'var(--text-secondary)'; }

function getCoords(feature) {
  if (!feature) return null;
  if (feature.geometry && feature.geometry.coordinates) {
    const [lng, lat] = feature.geometry.coordinates;
    return [lat, lng];
  }
  if (feature.lat && feature.lng) return [feature.lat, feature.lng];
  if (feature.latitude && feature.longitude) return [feature.latitude, feature.longitude];
  return null;
}

function MapFitter({ incidents }) {
  const map = useMap();
  useEffect(() => {
    const bounds = [];
    incidents.forEach(f => {
      const coords = getCoords(f);
      if (coords) bounds.push(coords);
    });
    if (bounds.length > 0) {
      setTimeout(() => {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.5 });
      }, 100);
    }
  }, [incidents, map]);
  return null;
}

function createCustomIcon(status, count) {
  const color = getColor(status);
  const size = count > 1 ? 28 : 16;
  const html = count > 1 
    ? `<div style="background:${color}; color:white; width:${size}px; height:${size}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; border: 2px solid white; box-shadow: var(--shadow-sm);">${count}</div>`
    : `<div style="background:${color}; width:${size}px; height:${size}px; border-radius:50%; border: 2px solid white; box-shadow: var(--shadow-sm);"></div>`;
  
  return L.divIcon({
    html,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

export default function LeafletMap({ incidents = [], height = '400px', filterStatus = null }) {
  const filtered = filterStatus
    ? incidents.filter((f) => (f.properties?.status || f.status) === filterStatus)
    : incidents;

  return (
    <div style={{ height: height === '100%' ? undefined : height, flex: height === '100%' ? 1 : 'none', width: '100%', borderRadius: 'var(--radius-card)', overflow: 'hidden', position: 'relative' }}>
      <MapContainer center={[19.5, 75.0]} zoom={6} style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }} zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFitter incidents={filtered} />
        {filtered.map((feature, idx) => {
          const coords = getCoords(feature);
          if (!coords) return null;
          const props = feature.properties || feature;
          const status = props.status || 'REPORT';
          const count = props.report_count || props.reportCount || 1;
          return (
            <Marker key={props.id || idx} position={coords} icon={createCustomIcon(status, count)}>
              <Popup>
                <div className="map-popup">
                  <strong>{props.syndrome || props.disease || 'Unknown'}</strong>
                  <div>{props.species || ''}</div>
                  <div>{props.village || props.location || ''}</div>
                  <div>{props.district || ''}</div>
                  <div><em style={{color: getColor(status)}}>{status}</em></div>
                  <div className="popup-date">
                    {props.capturedAt || props.started_at || props.detected_at ? formatKolkataTime(props.capturedAt || props.started_at || props.detected_at) : ''}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
