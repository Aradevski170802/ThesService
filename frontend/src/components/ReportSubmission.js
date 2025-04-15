import React, { useState } from 'react';
import Step1Form from './Step1Form';
import Step2Map from './Step2Map';
import Step3Photos from './Step3Photos';
import { LinearProgress, Button } from '@mui/material';
import '../styles/ReportSubmission.css'; // Import your CSS file for styling

const ReportSubmission = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    lat: '',
    lng: '',
    photos: []
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);  // Go back to the previous step
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Initialize formData object if it's not already
    const formData = new FormData();
    
    // Attach required fields
    formData.append('title', formData.title);
    formData.append('description', formData.description);
    formData.append('category', formData.category);
    formData.append('location', formData.location);
    formData.append('anonymous', formData.anonymous || false);
    formData.append('emergency', formData.emergency || false);
  
    // Initialize formData.photos as an empty array if it's not set
    if (!formData.photos) {
      formData.photos = [];
    }
  
    // Append photos only if they exist
    if (formData.photos.length > 0) {
      formData.append('photos', formData.photos);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: formData,
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

      {/* Progress Bar */}
      <LinearProgress variant="determinate" value={(step / 3) * 100} />

      {/* Step 1: Title, Description, Category */}
      {step === 1 && <Step1Form onNext={handleNext} formData={formData} setFormData={setFormData} />}
      
      {/* Step 2: Map Location */}
      {step === 2 && <Step2Map onNext={handleNext} onPrev={handlePrevious} formData={formData} setFormData={setFormData} />}
      
      {/* Step 3: Upload Photos */}
      {step === 3 && <Step3Photos onSubmit={handleSubmit} onPrevious={handlePrevious} formData={formData} setFormData={setFormData} />}

      {/* Conditional Buttons */}
      <div className="button-group">
        {step > 1 && (
          <Button variant="outlined" onClick={handlePrevious}>
            Previous
          </Button>
        )}

        {/* Only show Next or Submit Report button, depending on the step */}
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
