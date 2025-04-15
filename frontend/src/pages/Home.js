import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Create and import your CSS/SCSS file

const Home = () => {
  return (
    <div className="container">
      <header className="home-header">
        <h1 className="home-title">Public Infrastructure Maintenance</h1>
        <div className="home-buttons">
          <Link to="/login">
            <button className="btn primary-btn" style={{ marginRight: '10px' }}>Login</button>
          </Link>
          <Link to="/register">
            <button className="btn outlined-btn">Register</button>
          </Link>
        </div>
      </header>

      <section className="home-section">
        <h2 className="home-subtitle">Welcome to the Public Infrastructure Maintenance System</h2>
        <p className="home-text">
          This platform allows you to report infrastructure issues like potholes, broken streetlights, and more.
          Your reports help us improve the city's services and maintain public safety.
        </p>
        <Link to="/reports">
          <button className="btn secondary-btn">Report an Issue</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
