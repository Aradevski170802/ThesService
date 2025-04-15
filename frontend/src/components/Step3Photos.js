import React, { useState } from 'react';
import { Button } from '@mui/material';
import '../styles/Step3Photos.css'; // Import your CSS file for styling

const Step3Photos = ({ onSubmit, onPrevious, formData, setFormData }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length <= 4) {
      // Convert FileList to an array
      const fileArray = Array.from(files);

      // Set selected files in the state
      setSelectedFiles(fileArray);

      // Update formData with photos (converted to array)
      setFormData({ ...formData, photos: fileArray });
    } else {
      alert('You can only upload up to 4 files');
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setFormData({ ...formData, photos: updatedFiles });
  };

  return (
    <div className="step3-container">
      <h2>Step 3: Upload Photos</h2>
      <p>
        Upload up to 4 photos that best describe the issue. Photos should not contain faces.
      </p>

      <div className="file-upload-container">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
        />
        <label htmlFor="file-upload" className="upload-label">
          <span>Select Files</span>
        </label>

        <div className="file-preview">
          {selectedFiles.length > 0 && (
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    variant="text"
                    color="error"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Photos;
