import React, { useState } from 'react';
import { TextField, MenuItem, FormControl, Select, InputLabel, Button, FormHelperText } from '@mui/material';

const categories = [
  'Traffic & Road Safety',
  'Public Lighting',
  'Waste Management',
  'Water & Sewage',
  'Parks & Green Spaces',
  'Public Transport',
  'Building & Structural Safety',
  'Graffiti & Vandalism',
  'Miscellaneous'
];

const Step1Form = ({ onNext, formData, setFormData }) => {
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    // Check if any mandatory field is empty
    if (!formData.title || !formData.description || !formData.category) {
      setError('All fields are required');
    } else {
      setError('');
      onNext(formData);  // Proceed to next step
    }
  };

  return (
    <div>
      <h2>Step 1: Report Information</h2>

      <TextField
        label="Title *"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        error={error && !formData.title}
      />
      {error && !formData.title && <FormHelperText error>{error}</FormHelperText>}

      <TextField
        label="Description *"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        error={error && !formData.description}
      />
      {error && !formData.description && <FormHelperText error>{error}</FormHelperText>}

      <FormControl fullWidth margin="normal" required error={error && !formData.category}>
        <InputLabel>Category *</InputLabel>
        <Select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {error && !formData.category && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>

      {/* <Button variant="contained" color="primary" onClick={handleNext} style={{ marginTop: '20px' }}>
        Next
      </Button> */}
    </div>
  );
};

export default Step1Form;
