// frontend/src/components/Step2Map.js

import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Your custom pin image
import pinImage from '../assets/pin-removebg-preview.png';

const customIcon = L.icon({
  iconUrl: pinImage,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Default center (Thessaloniki)
const defaultLocation = { lat: 40.6401, lng: 22.9444 };

/**
 * Re-centers the map whenever `center` prop changes.
 */
function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

/**
 * Lets you click on the map to pick a new location.
 */
function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    }
  });

  return (
    <Marker position={[location.lat, location.lng]} icon={customIcon}>
      <Popup>Click on the map to select a location</Popup>
    </Marker>
  );
}

const Step2Map = ({ formData, setFormData }) => {
  // 1) State for the chosen location
  const [location, setLocation] = useState(defaultLocation);

  // 2) State for the human-readable address
  const [address, setAddress] = useState('');

  // 3) Whenever location changes, store it in formData
  useEffect(() => {
    setFormData(prev => ({ ...prev, location }));
  }, [location, setFormData]);

  // 4) Whenever location changes, reverse-geocode to get an address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`,
          { headers: { 'User-Agent': 'ThesService/1.0 youremail@example.com' } }
        );
        const data = await res.json();
        setAddress(data.display_name || 'No address found');
      } catch {
        setAddress('Error fetching address');
      }
    };
    fetchAddress();
  }, [location]);

  return (
    <div>
      <h2>Step 2: Select Location</h2>

      {/* Show the address */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>
          Selected Address:
        </label>
        <input
          type="text"
          value={address}
          readOnly
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      {/* The map, with re-centering logic */}
      <MapContainer
        center={[defaultLocation.lat, defaultLocation.lng]}
        zoom={13}
        style={{ width: '100%', height: 400 }}
      >
        <Recenter center={[location.lat, location.lng]} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker location={location} setLocation={setLocation} />
      </MapContainer>
    </div>
  );
};

export default Step2Map;
