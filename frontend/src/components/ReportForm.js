// frontend/src/components/ReportForm.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    department: '',
    anonymous: false,
    emergency: false,
    photos: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photos: [...e.target.files]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    
    if (!token) {
      alert('You need to be logged in to submit a report');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('location', formData.location);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('anonymous', formData.anonymous);
    formDataToSend.append('emergency', formData.emergency);

    formData.photos.forEach((file) => {
      formDataToSend.append('photos', file);
    });

    try {
      await axios.post('http://localhost:5000/api/reports', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send token with the request
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Report submitted successfully');
    } catch (err) {
      alert('Error submitting report');
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 600, margin: 'auto', paddingTop: '50px' }}>
        <Typography variant="h5" component="h1" gutterBottom>Submit a Report</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
            Submit Report
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ReportForm;
