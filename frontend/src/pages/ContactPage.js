// src/pages/ContactPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ContactPage = () => {
  // form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // submission feedback
  const [status, setStatus] = useState({ type: '', msg: '' });

  // handle input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    try {
      // POST to your backend
      await axios.post('http://localhost:5000/api/contact', form);

      // show success & reset form
      setStatus({
        type: 'success',
        msg: 'Your message has been sent! We’ll get back to you shortly.'
      });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.message || 'Unable to send message. Please try again later.'
      });
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #f0f4c3 0%, #c8e6c9 100%)',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Contact Us
        </Typography>

        {status.msg && (
          <Alert severity={status.type} sx={{ mb: 2 }}>
            {status.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            name="name"
            label="Your Name"
            fullWidth
            required
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Your Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            name="message"
            label="Message"
            multiline
            rows={6}
            fullWidth
            required
            margin="normal"
            value={form.message}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            fullWidth
            sx={{ mt: 2 }}
          >
            Send Message
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
