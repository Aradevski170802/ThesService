// src/pages/ChangePasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage]       = useState('');
  const [successMessage, setSuccessMessage]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.message === 'Password changed successfully') {
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setErrorMessage(data.message || 'Unexpected response.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 360,
          width: '100%',
          p: 4,
          position: 'relative',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: '#ff105f' }}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          Change Password
        </Typography>

        {errorMessage && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" align="center" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: '#ff105f', '&:hover': { bgcolor: '#e00350' } }}
          >
            Update Password
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem'
          }}
        >
          
         
        </Box>
      </Paper>
    </Box>
  );
};

export default ChangePasswordPage;
