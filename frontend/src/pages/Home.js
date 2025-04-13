// frontend/src/pages/Home.js
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
        <Typography variant="h4" component="h1">Public Infrastructure Maintenance</Typography>
        <div>
          <Button variant="contained" color="primary" component={Link} to="/login" style={{ marginRight: '10px' }}>
            Login
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/register">
            Register
          </Button>
        </div>
      </header>

      <section style={{ textAlign: 'center', padding: '40px 0' }}>
        <Typography variant="h5" component="h2" paragraph>
          Welcome to the Public Infrastructure Maintenance System
        </Typography>
        <Typography variant="body1" paragraph>
          This platform allows you to report infrastructure issues like potholes, broken streetlights, and more.
          Your reports help us improve the city's services and maintain public safety.
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/reports">
          Report an Issue
        </Button>
      </section>
    </Container>
  );
};

export default Home;
