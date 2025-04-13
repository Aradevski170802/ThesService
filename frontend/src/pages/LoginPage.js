// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store the JWT token
      alert('Login successful!');
      navigate('/reports'); // Redirect to reports page after successful login
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
        <Typography variant="h5" component="h1" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
