import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Step2Map = ({ onNext, onPrev, formData, setFormData }) => {
  // Use the location from formData (which now is an object)
  const [location, setLocation] = useState(formData.location || { lat: 51.505, lng: -0.09 });

  // Custom hook for handling map clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // Update local state and parent formData with the new location
        setLocation({ lat, lng });
        setFormData({ ...formData, location: { lat, lng } });
        console.log("Latitude: ", lat, "Longitude: ", lng);
      },
    });
    return <Marker position={location}><Popup>Click to set location</Popup></Marker>;
  }

  return (
    <div>
      <h2>Step 2: Select Location</h2>
      <MapContainer center={location} zoom={13} style={{ width: '100%', height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      <div>
        <button onClick={onPrev}>Previous</button>
        <button onClick={() => onNext(formData)}>Next</button>
      </div>
    </div>
  );
};

export default Step2Map;
