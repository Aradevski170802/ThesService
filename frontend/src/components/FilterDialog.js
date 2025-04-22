// src/components/FilterDialog.js

import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardActionArea,
  CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../context/AuthContext';

// Possible statuses
const STATUSES = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Finished', label: 'Finished' },
];

// Possible categories
const CATEGORIES = [
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

export default function FilterDialog({
  open,
  onClose,
  onApply,
  filteredCount
}) {
  const { user } = useContext(AuthContext);

  // My Requests toggles
  const [showPublished, setShowPublished] = useState(false);
  const [showUnderReview, setShowUnderReview] = useState(false);


  // Status & category selections
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  // Utility to disable + tooltip when not logged in
  const wrapAuth = control => (
    <Tooltip title="You must be logged in to use this">
      <span>{control}</span>
    </Tooltip>
  );

  const toggleStatus = val =>
    setSelectedStatus(s =>
      s.includes(val) ? s.filter(x => x !== val) : [...s, val]
    );

  const toggleCategory = cat =>
    setSelectedCategory(c =>
      c.includes(cat) ? c.filter(x => x !== cat) : [...c, cat]
    );

  const handleClear = () => {
    setShowPublished(false);
    setShowUnderReview(false);

    setSelectedStatus([]);
    setSelectedCategory([]);
  };

  const handleApply = () => {
    onApply({
      showPublished,
      showUnderReview,

      statuses: selectedStatus,
      categories: selectedCategory
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Filters
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* My Requests */}
        <Typography variant="h6" gutterBottom>
          My Requests
        </Typography>
        <FormGroup>
          {user
            ? (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showPublished}
                      onChange={() => setShowPublished(!showPublished)}
                    />
                  }
                  label="Show my published requests"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showUnderReview}
                      onChange={() => setShowUnderReview(!showUnderReview)}
                    />
                  }
                  label="Show my requests under review"
                />

              </>
            )
            : (
              wrapAuth(
                <FormControlLabel
                  control={<Switch disabled />}
                  label="Show my published requests"
                />
              )
            )
          }
        </FormGroup>

        <Box my={2}><Divider /></Box>

        {/* Status filters */}
        <Typography variant="h6" gutterBottom>
          Request Statuses
        </Typography>
        <FormGroup row>
          {STATUSES.map(s => (
            <FormControlLabel
              key={s.value}
              control={
                <Checkbox
                  checked={selectedStatus.includes(s.value)}
                  onChange={() => toggleStatus(s.value)}
                />
              }
              label={s.label}
            />
          ))}
        </FormGroup>

        <Box my={2}><Divider /></Box>

        {/* Category filters */}
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Grid container spacing={1}>
          {CATEGORIES.map(cat => {
            const sel = selectedCategory.includes(cat);
            return (
              <Grid item key={cat}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sel}
                      onChange={() => toggleCategory(cat)}
                    />
                  }
                  label={cat}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button onClick={handleClear}>Clear All</Button>
        <Button variant="contained" onClick={handleApply}>
          Apply ({filteredCount.toLocaleString()} requests)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
