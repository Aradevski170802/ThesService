import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Public Infrastructure Maintenance</h1>
            <p className="hero-subtitle">Empowering you to help improve your city.</p>
            <Link to="/submit-report">
              <button className="hero-btn">Report an Issue</button>
            </Link>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="features">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-item" style={{ animationDelay: '0.2s' }}>
              <div className="feature-image">
                {/* Placeholder for future image */}
              </div>
              <h3 className="feature-title">Easy Reporting</h3>
              <p className="feature-text">
                Snap a photo and submit a report in just a few clicks.
              </p>
            </div>
            <div className="feature-item" style={{ animationDelay: '0.4s' }}>
              <div className="feature-image">
                {/* Placeholder for future image */}
              </div>
              <h3 className="feature-title">Real-Time Updates</h3>
              <p className="feature-text">
                Stay informed with updates as issues are addressed.
              </p>
            </div>
            <div className="feature-item" style={{ animationDelay: '0.6s' }}>
              <div className="feature-image">
                {/* Placeholder for future image */}
              </div>
              <h3 className="feature-title">Community Impact</h3>
              <p className="feature-text">
                Your voice helps create safer, better public spaces.
              </p>
            </div>
          </div>
        </section>

        <section className="about">
          <h2 className="section-title">About Our System</h2>
          <p className="about-text">
            Our Public Infrastructure Maintenance System connects citizens with local authorities to quickly address and resolve public infrastructure issues. Whether it's a pothole, a broken streetlight, or any other reportable concern, our streamlined platform empowers you to make a difference.
          </p>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Public Infrastructure Maintenance. All rights reserved.</p>
        <div className="footer-links">
          {/* <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link> */}
          <Link to="/faq">FAQ</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
