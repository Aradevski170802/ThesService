import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Import AuthContext
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);  // Access the user and logout from context
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen); // Function to toggle dropdown

  return (
    <nav className="navbar">
      <div className="navbar-title">
        Public Infrastructure Maintenance System
      </div>
      <div className="navbar-links">
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/submit-report" className="nav-link">Submit Report</Link>

        {user ? (
          <>
            <div className="dropdown">
              <button className="nav-link" onClick={toggleDropdown}>
                My Profile
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/change-password" className="dropdown-item">Change Password</Link>
                  <Link to="/change-email" className="dropdown-item">Change Email</Link>
                  <button onClick={logout} className="dropdown-item">Log Out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        <Link to="/" className="nav-link">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;
