// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, surname, email, password, phone, country });
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Error during registration');
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
        <Typography variant="h5" component="h1" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Surname"
            fullWidth
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            margin="normal"
            required
          />
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
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Country"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            margin="normal"
            required
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
