import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Desktop dropdown state
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = e => {
    e.stopPropagation();
    setDropdownOpen(o => !o);
  };

  // Mobile menu state
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = e => {
    e.stopPropagation();
    setMobileMenuOpen(o => !o);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* DESKTOP */}
      <nav className="navbar desktop-navbar" onClick={() => setDropdownOpen(false)}>
        <div className="navbar-container">
          <div className="navbar-title">
            <Link to="/">Public Infrastructure Maintenance</Link>
          </div>

          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/reports" className="nav-link">Reports</Link>
            <Link to="/submit-report" className="nav-link">Submit Report</Link>

            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}

            {user ? (
              <div className="dropdown">
                <button className="nav-link dropdown-toggle" onClick={toggleDropdown}>
                  My Profile
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu fade-in-scale">
                    <Link to="/change-password" className="dropdown-item">Change Password</Link>
                    <Link to="/change-email" className="dropdown-item">Change Email</Link>
                    <button onClick={logout} className="dropdown-item">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE */}
      <div className="mobile-nav-button" onClick={toggleMobileMenu}>Menu</div>
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <ul className="mobile-menu-links" onClick={e => e.stopPropagation()}>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/reports" onClick={() => setMobileMenuOpen(false)}>Reports</Link></li>
            <li><Link to="/submit-report" onClick={() => setMobileMenuOpen(false)}>Submit Report</Link></li>

            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              </li>
            )}

            {user ? (
              <>
                <li><Link to="/change-password" onClick={() => setMobileMenuOpen(false)}>Change Password</Link></li>
                <li><Link to="/change-email" onClick={() => setMobileMenuOpen(false)}>Change Email</Link></li>
                <li>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="mobile-logout-button"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>×</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
