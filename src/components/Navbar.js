import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme, cartCount } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/menu', label: 'Menu', icon: '🍽️' },
    { to: '/orders', label: 'Orders', icon: '📦' },
    { to: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔥</span>
          <span className="brand-name">Flavor<span className="brand-accent">Rush</span></span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/cart" className="cart-btn" onClick={() => setMobileOpen(false)}>
            <span>🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(o => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
