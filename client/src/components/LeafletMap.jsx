import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_COLORS = {
  REPORT: '#757575',
  CASE: '#1976D2',
  CLUSTER: '#F57F17',
  SUSPECTED_OUTBREAK: '#C62828',
  CONFIRMED: '#2E7D32',
  RESPONSE: '#6A1B9A',
};

function getColor(status) {
  return STATUS_COLORS[status] || '#757575';
}

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

export default function LeafletMap({ incidents = [], height = '400px', filterStatus = null }) {
  const filtered = filterStatus
    ? incidents.filter((f) => (f.properties?.status || f.status) === filterStatus)
    : incidents;

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[22.3, 72.1]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((feature, idx) => {
          const coords = getCoords(feature);
          if (!coords) return null;
          const props = feature.properties || feature;
          const status = props.status || 'REPORT';
          const color = getColor(status);
          return (
            <CircleMarker
              key={props.id || idx}
              center={coords}
              radius={status === 'SUSPECTED_OUTBREAK' ? 14 : status === 'CLUSTER' ? 11 : 8}
              pathOptions={{ fillColor: color, color: color, fillOpacity: 0.75, weight: 2 }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{props.syndrome || props.disease || 'Unknown'}</strong>
                  <div>{props.species || ''}</div>
                  <div>{props.village || props.location || ''}</div>
                  <div>{props.district || ''}</div>
                  <div><em>{status}</em></div>
                  <div className="popup-date">
                    {props.capturedAt ? new Date(props.capturedAt).toLocaleDateString('en-IN') : ''}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}