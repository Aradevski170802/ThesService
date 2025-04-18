import React from 'react';
import { Button } from '@mui/material';

const Step3Photos = ({ onSubmit, onPrevious, formData, setFormData }) => {
  const handleFileChange = (e) => {
    setFormData({ ...formData, photos: e.target.files });
  };

  return (
    <div>
      <h2>Step 3: Upload Photos</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <div>
        {/* <button onClick={onPrevious}>Previous</button>
        <button onClick={onSubmit}>Submit Report</button> */}
      </div>
    </div>
  );
};

export default Step3Photos;
