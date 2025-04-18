import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const Step1Form = ({ onNext, formData, setFormData }) => {
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setError('All fields are required');
    } else {
      setError('');
      onNext(formData);
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
          <MenuItem value="Traffic & Road Safety">Traffic & Road Safety</MenuItem>
          <MenuItem value="Public Lighting">Public Lighting</MenuItem>
          <MenuItem value="Waste Management">Waste Management</MenuItem>
          <MenuItem value="Water & Sewage">Water & Sewage</MenuItem>
          <MenuItem value="Parks & Green Spaces">Parks & Green Spaces</MenuItem>
          <MenuItem value="Public Transport">Public Transport</MenuItem>
          <MenuItem value="Building & Structural Safety">Building & Structural Safety</MenuItem>
          <MenuItem value="Graffiti & Vandalism">Graffiti & Vandalism</MenuItem>
          <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
        </Select>
        {error && !formData.category && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>

      {/* <Button variant="contained" color="primary" onClick={handleNext}>Next</Button> */}
    </div>
  );
};

export default Step1Form;
