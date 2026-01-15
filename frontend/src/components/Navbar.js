import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaUserPlus, FaCalendarAlt, FaBars, FaTimes, FaSignInAlt, FaSignOutAlt, FaUser, FaCog, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { path: '/noticeboard', label: 'Noticeboard', icon: <FaBullhorn /> },
    { path: '/recruitment', label: 'Recruitment', icon: <FaUserPlus /> },
    { path: '/events', label: 'Events', icon: <FaCalendarAlt /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAdminLink = () => {
    if (user?.role === 'superadmin') {
      return { path: '/superadmin', label: 'Manage Admins', icon: <FaUserShield /> };
    } else if (user?.role === 'clubadmin') {
      return { path: '/admin', label: 'Admin Panel', icon: <FaCog /> };
    }
    return null;
  };

  return (
    <nav className="navbar light-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text">Clubs</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path || (location.pathname === '/' && item.path === '/noticeboard') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-info">
                <FaUser />
                <span className="user-name">{user?.name || 'Admin'}</span>
              </span>
              {getAdminLink() && (
                <Link to={getAdminLink().path} className="btn-admin">
                  {getAdminLink().icon}
                  <span>{getAdminLink().label}</span>
                </Link>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
