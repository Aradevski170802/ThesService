import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for customizing markers
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.6401, // Default center location (Thessaloniki)
  lng: 22.9444
};

const Map = ({ reports }) => {
  const isValidLatLng = (lat, lng) => !isNaN(lat) && !isNaN(lng);  // Check if latitude and longitude are valid

  return (
    <MapContainer center={center} zoom={12} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap as tile layer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {reports.map((report) => {
        // Access lat and lng from location object
        const lat = report.location?.lat;
        const lng = report.location?.lon;

        // Only create marker if the lat/lng are valid
        if (isValidLatLng(lat, lng)) {
          return (
            <Marker
              key={report._id}
              position={{ lat, lng }}
              icon={new L.Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
              })}
            >
              <Popup>
                <div>
                  <h3>{report.location ? `${report.location.lat}, ${report.location.lon}` : 'Location not available'}</h3>
                  <p>{report.status}</p>
                </div>
              </Popup>
            </Marker>
          );
        }

        return null;  // Don't render anything if lat/lng are invalid
      })}
    </MapContainer>
  );
};

export default Map;
