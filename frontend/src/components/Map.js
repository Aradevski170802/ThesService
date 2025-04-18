// frontend/src/components/Map.js

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.6401,
  lng: 22.9444
};

// Helper to grab only street number + street name
const getSimpleAddress = (full) => {
  if (!full) return '';
  const parts = full.split(',').map(s => s.trim());
  return parts.length > 1
    ? `${parts[0]}, ${parts[1]}`
    : parts[0];
};

const Map = ({ reports, onMarkerClick }) => {
  const isValid = (lat, lng) =>
    typeof lat === 'number' && typeof lng === 'number';

  return (
    <MapContainer center={center} zoom={12} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {reports.map(report => {
        const lat = report.location?.lat;
        const lng = report.location?.lon;
        if (!isValid(lat, lng)) return null;

        return (
          <Marker
            key={report._id}
            position={{ lat, lng }}
            icon={
              new L.Icon({
                iconUrl:
                  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
              })
            }
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 8px' }}>
                  {report.address
                    ? getSimpleAddress(report.address)
                    : `Lat ${lat.toFixed(5)}, Lon ${lng.toFixed(5)}`}
                </h4>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onMarkerClick(report._id)}
                >
                  View Report
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
