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
  
    // Ensure the location is correctly structured as an object (if required)
    const location = {
      lat: formData.lat, // Ensure formData.lat is populated with the correct value
      lon: formData.lng  // Ensure formData.lng is populated with the correct value
    };
  
    // Log location for debugging
    console.log('Location:', location);
  
    // Create a new FormData object
    const form = new FormData();
  
    // Append required fields from formData state
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    
    // Send location as stringified object
    if (formData.lat && formData.lng) {
            const location = {
              lat: formData.lat,
              lon: formData.lng,
             };
             form.append('location', JSON.stringify(location));  // Send location as stringified object
           }
         
      
  
    form.append('anonymous', formData.anonymous || false);
    form.append('emergency', formData.emergency || false);
    
  
    // Ensure photos is always an array (empty array if no photos)
    const photos = formData.photos || [];  // Default to an empty array if no photos
  
    // Append photos only if they exist
    photos.forEach((photo) => {
      form.append('photos', photo);  // Append each photo as a separate file
    });
  
    // Log the form data before submitting for debugging
    console.log('Form Data before submitting:', formData);
  
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: form,
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
