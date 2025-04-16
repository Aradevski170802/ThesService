import React, { useState } from 'react';
import Step1Form from './Step1Form';
import Step2Map from './Step2Map';
import Step3Photos from './Step3Photos';
import { LinearProgress, Button } from '@mui/material';
import '../styles/ReportSubmission.css';

const ReportSubmission = () => {
  // Update initial state to include location as an object
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { lat: 51.505, lng: -0.09 },  // Default location (London)
    photos: [],
    anonymous: false,
    emergency: false
  });

  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    // Pass location as a JSON string
    formDataToSend.append('location', JSON.stringify(formData.location));
    formDataToSend.append('anonymous', formData.anonymous);
    formDataToSend.append('emergency', formData.emergency);

    // Append photos if available
    if (formData.photos.length > 0) {
      Array.from(formData.photos).forEach((file) => {
        formDataToSend.append('photos', file);
      });
    }

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (response.ok) {
        alert('Report submitted successfully!');
      } else {
        alert('Error submitting report: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };

  return (
    <div className="form-container">
      <h1>Submit a Report</h1>
      <LinearProgress variant="determinate" value={(step / 3) * 100} />

      {step === 1 && (
        <Step1Form onNext={handleNext} formData={formData} setFormData={setFormData} />
      )}
      {step === 2 && (
        <Step2Map onNext={handleNext} onPrev={handlePrevious} formData={formData} setFormData={setFormData} />
      )}
      {step === 3 && (
        <Step3Photos onSubmit={handleSubmit} onPrevious={handlePrevious} formData={formData} setFormData={setFormData} />
      )}

      <div className="button-group">
        {step > 1 && (
          <Button variant="outlined" onClick={handlePrevious}>Previous</Button>
        )}
        {step < 3 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Report</Button>
        )}
      </div>
    </div>
  );
};

export default ReportSubmission;
