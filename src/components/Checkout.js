import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Checkout.css';

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

export default function Checkout() {
  const { cart, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    name: '', phone: '', flat: '', street: '', city: '', pincode: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderId] = useState(() => `#FR-${Math.floor(10000 + Math.random() * 90000)}`);

  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + DELIVERY_FEE + tax;

  const estimatedDelivery = (() => {
    const items = step === 3 ? orderItems : cart;
    if (items.length === 0) return '25-35 min';
    const times = items.map(item => {
      const match = (item.deliveryTime || '20-30 min').match(/(\d+)-(\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2])] : [20, 30];
    });
    const maxLow = Math.max(...times.map(t => t[0]));
    const maxHigh = Math.max(...times.map(t => t[1]));
    return `${maxLow}-${maxHigh} min`;
  })();

  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cart, step, navigate]);

  const validateAddress = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Name is required';
    if (!address.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(address.phone.trim())) e.phone = 'Must be 10 digits';
    if (!address.flat.trim()) e.flat = 'Required';
    if (!address.street.trim()) e.street = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.pincode.trim()) e.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = 'Must be 6 digits';
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validateAddress()) setStep(2);
  };

  const handlePlaceOrder = () => {
    setOrderItems([...cart]);
    setOrderTotal(total);
    const deliveryInfo = {
      name: address.name,
      phone: address.phone,
      address: `${address.flat}, ${address.street}, ${address.city} - ${address.pincode}`,
      total,
      deliveryFee: DELIVERY_FEE,
      tax,
      paymentMethod,
    };
    placeOrder(deliveryInfo);
    setStep(3);
  };

  if (cart.length === 0 && step !== 3) return null;

  return (
    <div className="page checkout-page">
      {/* Step Indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`step-circle ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`step-line ${step > s ? 'active' : ''}`}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="step-labels">
        <span className={step >= 1 ? 'active' : ''}>Address</span>
        <span className={step >= 2 ? 'active' : ''}>Payment</span>
        <span className={step >= 3 ? 'active' : ''}>Confirmation</span>
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="checkout-step card">
          <h2>📍 Delivery Address</h2>
          <p className="step-subtitle">Step 1 of 3</p>
          <div className="checkout-form">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className={`form-input ${addressErrors.name ? 'input-error' : ''}`}
                placeholder="John Doe"
                value={address.name}
                onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
              />
              {addressErrors.name && <span className="error-msg">{addressErrors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                className={`form-input ${addressErrors.phone ? 'input-error' : ''}`}
                placeholder="9876543210"
                value={address.phone}
                onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
              />
              {addressErrors.phone && <span className="error-msg">{addressErrors.phone}</span>}
            </div>
            <div className="checkout-form-row">
              <div className="form-group">
                <label className="form-label">Flat / House No. *</label>
                <input
                  className={`form-input ${addressErrors.flat ? 'input-error' : ''}`}
                  placeholder="A-204"
                  value={address.flat}
                  onChange={e => setAddress(a => ({ ...a, flat: e.target.value }))}
                />
                {addressErrors.flat && <span className="error-msg">{addressErrors.flat}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  className={`form-input ${addressErrors.street ? 'input-error' : ''}`}
                  placeholder="MG Road"
                  value={address.street}
                  onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                />
                {addressErrors.street && <span className="error-msg">{addressErrors.street}</span>}
              </div>
            </div>
            <div className="checkout-form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  className={`form-input ${addressErrors.city ? 'input-error' : ''}`}
                  placeholder="Bengaluru"
                  value={address.city}
                  onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                />
                {addressErrors.city && <span className="error-msg">{addressErrors.city}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input
                  className={`form-input ${addressErrors.pincode ? 'input-error' : ''}`}
                  placeholder="560001"
                  value={address.pincode}
                  onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))}
                />
                {addressErrors.pincode && <span className="error-msg">{addressErrors.pincode}</span>}
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleContinue}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="checkout-step card">
          <h2>💳 Payment Method</h2>
          <p className="step-subtitle">Step 2 of 3</p>
          <div className="checkout-form">
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                <span className="payment-icon">📱</span>
                <span>UPI</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span className="payment-icon">💳</span>
                <span>Credit / Debit Card</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="payment-icon">💵</span>
                <span>Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input
                  className="form-input"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    className="form-input"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="checkout-form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input
                      className="form-input"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      className="form-input"
                      placeholder="•••"
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'cod' && (
              <div className="cod-note">
                <span className="cod-icon">💵</span>
                <span>Pay <strong>₹{total.toFixed(0)}</strong> on delivery</span>
              </div>
            )}

            <div className="checkout-total-row">
              <span>Order Total:</span>
              <span className="total-price">₹{total.toFixed(0)}</span>
            </div>

            <div className="checkout-btn-row">
              <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder}>
                Place Order 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="checkout-step confirmation-step">
          <div className="success-checkmark">
            <svg viewBox="0 0 52 52" className="checkmark-svg">
              <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
            </svg>
          </div>
          <h1 className="confirmation-title">Order Placed! 🎉</h1>
          <p className="order-id-display">Order ID: <strong>{orderId}</strong></p>

          <div className="order-summary-card card">
            <h3>Order Summary</h3>
            <div className="divider"></div>
            <div className="confirmation-items">
              {orderItems.map((item, i) => (
                <div key={i} className="confirmation-item">
                  <span>{item.emoji} {item.name}</span>
                  <span>x{item.qty}</span>
                  <span>₹{(item.price * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="confirmation-total">
              <span>Total</span>
              <span className="total-price">₹{orderTotal.toFixed(0)}</span>
            </div>
          </div>

          <div className="delivery-eta-banner">
            <span>🕐</span>
            <span>Estimated delivery: <strong>{estimatedDelivery}</strong></span>
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
            ← Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
