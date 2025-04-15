import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReportForm.css';

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
    const token = localStorage.getItem('token');
    
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Report submitted successfully');
    } catch (err) {
      alert('Error submitting report');
    }
  };

  return (
    <div className="container report-form-container">
      <div className="form-wrapper">
        <h1>Submit a Report</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} />
              Report Anonymously
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" name="emergency" checked={formData.emergency} onChange={handleChange} />
              Mark as Emergency
            </label>
          </div>
          <div className="form-group">
            <label>Photos</label>
            <input type="file" name="photos" onChange={handleFileChange} multiple />
          </div>
          <button type="submit" className="btn">Submit Report</button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
