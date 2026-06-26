import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal } = useApp();
  const navigate = useNavigate();

  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + DELIVERY_FEE + tax;

  const estimatedDelivery = (() => {
    if (cart.length === 0) return '25-35 min';
    const times = cart.map(item => {
      const match = (item.deliveryTime || '20-30 min').match(/(\d+)-(\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2])] : [20, 30];
    });
    const maxLow = Math.max(...times.map(t => t[0]));
    const maxHigh = Math.max(...times.map(t => t[1]));
    return `${maxLow}-${maxHigh} min`;
  })();

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state" style={{ paddingTop: '120px' }}>
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse our menu and add something delicious!</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Menu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          <div className="cart-header-row">
            <h1>Your Cart <span className="cart-count-label">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span></h1>
            <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear all</button>
          </div>

          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item card">
                <div className="cart-item-emoji">{item.emoji}</div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span className="badge badge-muted">{item.category}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-stepper">
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty - 1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          <Link to="/menu" className="btn btn-secondary" style={{ marginTop: '8px' }}>
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="cart-summary card">
          <h2>Order Summary</h2>
          <div className="divider"></div>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({cart.reduce((s,c) => s + c.qty, 0)} items)</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery fee</span>
              <span>₹{DELIVERY_FEE.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            <div className="summary-row promo-row">
              <input className="form-input promo-input" placeholder="Promo code (e.g. FIRST20)" />
              <button className="btn btn-secondary btn-sm">Apply</button>
            </div>
          </div>
          <div className="divider"></div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span className="total-price">₹{total.toFixed(0)}</span>
          </div>
          <div className="cart-eta-banner">
            <span>🕐</span>
            <span>Estimated delivery: <strong>{estimatedDelivery}</strong></span>
          </div>
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout →
          </button>
          <p className="secure-note">🔒 Secure checkout · Free cancellation</p>
        </div>
      </div>
    </div>
  );
}
