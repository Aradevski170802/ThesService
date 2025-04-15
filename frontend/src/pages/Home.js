import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; 

const Home = () => {
  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero-section">
        <nav className="hero-nav">
        
        </nav>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Let’s do it. <br />
            <span className="highlighted-text">Make the city better!</span>
          </h1>
          <p className="hero-subtitle">
            "Improving my city" is the daily problem management service that gives you the tools to report and solve issues in your neighborhood.
          </p>
          <div className="hero-buttons">
            <Link to="/reports">
              <button className="cta-btn">Report an Issue</button>
            </Link>
            <Link to="/learnmore">
              <button className="cta-btn darkblue-btn">test learn more </button>
            </Link>
          </div>
          <img 
    src="../images/download.jfif  "  
    alt="random image im gonna generate"
    className="hero-image"
  />
         
        </div>
      </section>

      {/* INFO SECTION  */}
      <section className="info-section">
        <h2 className="info-title">
          Complete service submission, management, and analysis requests
        </h2>
        <p className="info-text">
          Direct communication between citizens and the municipality to keep our neighborhoods clean and safe.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>© 2025 City Maintenance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
