import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      const userData = {
        name,
        surname,
        email,
        password,
        confirmPassword,
        phone,
        country,
      };

      await axios.post('http://localhost:5000/api/auth/register', userData);
      alert('Registration successful! Please check your email for verification.');
      navigate('/verify'); // Navigate to the verification page
    } catch (error) {
      console.error("Error during registration:", error.response ? error.response.data : error);
      alert('Error during registration');
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
        <Typography variant="h5" component="h1" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
          <TextField label="Surname" fullWidth value={surname} onChange={(e) => setSurname(e.target.value)} margin="normal" required />
          <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required error={!!emailError} helperText={emailError} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          <TextField label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" required error={!!passwordError} helperText={passwordError} />
          <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} margin="normal" />
          <TextField label="Country" fullWidth value={country} onChange={(e) => setCountry(e.target.value)} margin="normal" required />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
