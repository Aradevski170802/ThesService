import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  Container,
  Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';

const ChangeEmailPage = () => {
  const [newEmail, setNewEmail] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setFeedback({ type: '', msg: '' });
    const token = localStorage.getItem('token');
    if (!token) {
      setFeedback({ type: 'error', msg: 'You need to be logged in.' });
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/change-email',
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback({ type: 'success', msg: res.data.message });
      setTimeout(() => navigate('/verify-email'), 2000);
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to change email'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #42A5F5 0%, #478ED1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change Email
            </Typography>
            {feedback.msg && (
              <Alert severity={feedback.type} sx={{ width: '100%', mt: 2 }}>
                {feedback.msg}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              <TextField
                label="New Email Address"
                type="email"
                fullWidth
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangeEmailPage;
