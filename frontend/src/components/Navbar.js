import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
<Link to="/HomePage" className='nav-link'> Public Infrastructure Maintenance System</Link>


      </div>
      <div className="navbar-links">
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/submit-report" className="nav-link">Submit Report</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
