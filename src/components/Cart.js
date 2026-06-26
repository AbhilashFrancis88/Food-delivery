import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal, placeOrder } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + DELIVERY_FEE + tax;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;
    placeOrder({ ...form, total, deliveryFee: DELIVERY_FEE, tax });
    setShowCheckout(false);
    navigate('/orders');
  };

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
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '20px' }}
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout →
          </button>
          <p className="secure-note">🔒 Secure checkout · Free cancellation</p>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Delivery Details</h2>
              <button className="modal-close" onClick={() => setShowCheckout(false)}>✕</button>
            </div>

            <div className="checkout-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  className={`form-input ${errors.address ? 'input-error' : ''}`}
                  placeholder="123 MG Road, Bengaluru, Karnataka 560001"
                  rows={3}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <textarea
                  className="form-input"
                  placeholder="Allergies, gate code, doorbell notes..."
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <div className="checkout-total-row">
                <span>Order Total:</span>
                <span className="total-price">₹{total.toFixed(0)}</span>
              </div>

              <button className="btn btn-primary btn-full btn-lg" onClick={handleOrder}>
                Place Order 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
