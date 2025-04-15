import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    );
    const data = await response.json();
    if (data && data[0]) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      alert('Address not found!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
  }
};

const Step2Map = ({ onNext, onPrev, formData, setFormData }) => {
  const [address, setAddress] = useState(''); // Track address input
  const [latLng, setLatLng] = useState([40.6401, 22.9444]); // Default location (Thessaloniki)
  const [markerPosition, setMarkerPosition] = useState([40.6401, 22.9444]); // Default marker position

  const handleAddressChange = async (e) => {
    setAddress(e.target.value);
    const location = await geocodeAddress(e.target.value);
    if (location) {
      setLatLng([location.lat, location.lon]);
      setMarkerPosition([location.lat, location.lon]);
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLatLng([lat, lng]);
    setMarkerPosition([lat, lng]);
    getAddressFromLatLng(lat, lng); // Update address input after clicking on map
  };

  const getAddressFromLatLng = async (lat, lon) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    if (data && data.display_name) {
      setAddress(data.display_name);
    }
  };

  const handleNext = () => {
    setFormData({ ...formData, location: { lat: markerPosition[0], lon: markerPosition[1] } });
    onNext();
  };

  return (
    <div>
      <h2>Step 2: Select Location</h2>

      {/* Address Input */}
      <TextField
        label="Enter Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={address}
        onChange={handleAddressChange}
        placeholder="Type the address here"
      />

      {/* Interactive Map */}
      <MapContainer
        center={latLng}
        zoom={13}
        style={{ width: '100%', height: '400px' }}
        whenCreated={(map) => map.on('click', handleMapClick)} // Handle click event
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} eventHandlers={{ click: handleMapClick }}>
          <Popup>
            {`Latitude: ${markerPosition[0]} | Longitude: ${markerPosition[1]}`}
          </Popup>
        </Marker>
      </MapContainer>

      {/* <Button variant="outlined" onClick={onPrev}>Previous</Button>
      <Button variant="contained" color="primary" onClick={handleNext}>Next</Button> */}
    </div>
  );
};

export default Step2Map;
