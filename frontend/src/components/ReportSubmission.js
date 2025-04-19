// frontend/src/components/ReportSubmission.js
import React, { useState } from 'react';
import Step1Form from './Step1Form';
import Step2Map from './Step2Map';
import Step3Photos from './Step3Photos';
import { LinearProgress, Button } from '@mui/material';
import '../styles/ReportSubmission.css';

const ReportSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { lat: 51.505, lng: -0.09 },
    photos: [],
    anonymous: false,
    emergency: false
  });
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrevious = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Check for token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a report.');
      return;
    }

    // 2) Build FormData payload
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('location', JSON.stringify(formData.location));
    payload.append('anonymous', formData.anonymous);
    payload.append('emergency', formData.emergency);
    Array.from(formData.photos).forEach(f => payload.append('photos', f));

    try {
      // 3) Send request with Authorization header
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });

      const data = await response.json();
      if (response.ok) {
        alert('Report submitted successfully! Check your email for confirmation.');
        // Optionally reset form or navigate elsewhere
        setFormData({
          title: '',
          description: '',
          category: '',
          location: { lat: 51.505, lng: -0.09 },
          photos: [],
          anonymous: false,
          emergency: false
        });
        setStep(1);
      } else {
        alert('Error submitting report: ' + data.message);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Error submitting report');
    }
  };

  return (
    <div className="form-container">
      <h1>Submit a Report</h1>
      <LinearProgress variant="determinate" value={(step / 3) * 100} />

      {step === 1 && (
        <Step1Form
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <Step2Map
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrev={handlePrevious}
        />
      )}
      {step === 3 && (
        <Step3Photos
          formData={formData}
          setFormData={setFormData}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      )}

      <div className="button-group">
        {step > 1 && (
          <Button variant="outlined" onClick={handlePrevious}>
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportSubmission;
