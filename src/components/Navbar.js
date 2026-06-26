import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme, cartCount, cartAnimTrigger, deliveryAddress, setDeliveryAddress } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressInput, setAddressInput] = useState(deliveryAddress);
  const prevTrigger = useRef(0);

  useEffect(() => {
    if (cartAnimTrigger > prevTrigger.current) {
      setWiggle(true);
      prevTrigger.current = cartAnimTrigger;
      const timer = setTimeout(() => setWiggle(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartAnimTrigger]);

  useEffect(() => {
    setAddressInput(deliveryAddress);
  }, [deliveryAddress]);

  const handleSaveAddress = () => {
    setDeliveryAddress(addressInput);
    setShowAddressModal(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/menu', label: 'Menu', icon: '🍽️' },
    { to: '/favourites', label: 'Favourites', icon: '❤️' },
    { to: '/orders', label: 'Orders', icon: '📦' },
    { to: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <img src="/logo.svg" alt="" className="brand-logo" />
            <span className="brand-name">Flavor<span className="brand-accent">Rush</span></span>
          </Link>

          <div className="navbar-address-desktop" onClick={() => setShowAddressModal(true)}>
            <span className="address-pin">📍</span>
            {deliveryAddress ? (
              <>
                <span className="address-text">{deliveryAddress.length > 30 ? deliveryAddress.substring(0, 30) + '...' : deliveryAddress}</span>
                <span className="address-change">Change</span>
              </>
            ) : (
              <span className="address-placeholder">Enter delivery address</span>
            )}
          </div>

          <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            <div className="navbar-address-mobile" onClick={() => { setShowAddressModal(true); setMobileOpen(false); }}>
              <span className="address-pin">📍</span>
              {deliveryAddress ? (
                <>
                  <span className="address-text">{deliveryAddress.length > 30 ? deliveryAddress.substring(0, 30) + '...' : deliveryAddress}</span>
                  <span className="address-change">Change</span>
                </>
              ) : (
                <span className="address-placeholder">Enter delivery address</span>
              )}
            </div>
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

            <Link to="/cart" className={`cart-btn ${wiggle ? 'wiggle' : ''}`} onClick={() => setMobileOpen(false)}>
              <span>🛒</span>
              {cartCount > 0 && <span key={cartAnimTrigger} className="cart-badge">{cartCount}</span>}
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

      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal address-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📍 Delivery Address</h2>
              <button className="modal-close" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            <div className="address-form">
              <input
                className="form-input"
                placeholder="Enter your delivery address"
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveAddress()}
              />
              <div className="address-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddressModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveAddress}>Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
