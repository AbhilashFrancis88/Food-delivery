import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Orders.css';

const STATUSES = ['Preparing', 'On the way', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="page">
        <div className="empty-state" style={{ paddingTop: '120px' }}>
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Place your first order to see it here!</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Order Food →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Filter */}
      <div className="orders-filter">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`cat-tab ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No orders with this status</h3>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map(order => (
            <div key={order.id} className="order-card card">
              {/* Order Header */}
              <div
                className="order-header"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="order-left">
                  <div className="order-emojis">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} title={item.name}>{item.emoji}</span>
                    ))}
                    {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                  </div>
                  <div>
                    <div className="order-id">Order #{order.id.split('-')[0].toUpperCase()}</div>
                    <div className="order-date">{formatDate(order.placedAt)}</div>
                  </div>
                </div>
                <div className="order-right">
                  <span className={`status-pill status-${order.status}`}>{order.status}</span>
                  <span className="order-total">₹{order.total.toFixed(0)}</span>
                  <span className="expand-icon">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === order.id && (
                <div className="order-details">
                  <div className="divider"></div>

                  {/* Delivery info */}
                  <div className="order-delivery-info">
                    <div className="delivery-item">
                      <span className="delivery-label">📍 Deliver to</span>
                      <span>{order.deliveryInfo.name} · {order.deliveryInfo.address}</span>
                    </div>
                    <div className="delivery-item">
                      <span className="delivery-label">📞 Contact</span>
                      <span>{order.deliveryInfo.phone}</span>
                    </div>
                    <div className="delivery-item">
                      <span className="delivery-label">⏱ Est. delivery</span>
                      <span>{order.estimatedDelivery}</span>
                    </div>
                    {order.deliveryInfo.notes && (
                      <div className="delivery-item">
                        <span className="delivery-label">📝 Notes</span>
                        <span>{order.deliveryInfo.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="divider"></div>

                  {/* Items */}
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <span>{item.emoji} {item.name}</span>
                        <span>x{item.qty}</span>
                        <span>₹{(item.price * item.qty).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="order-item-row subtotal-row">
                      <span>Delivery fee</span>
                      <span></span>
                      <span>₹{order.deliveryInfo.deliveryFee?.toFixed(0) || '49'}</span>
                    </div>
                    <div className="order-item-row total-row">
                      <span><strong>Total</strong></span>
                      <span></span>
                      <span><strong>₹{order.total.toFixed(0)}</strong></span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Actions */}
                  <div className="order-actions">
                    <div className="status-update">
                      <label className="form-label" style={{ marginBottom: 0 }}>Update status:</label>
                      <div className="status-btns">
                        {STATUSES.map(s => (
                          <button
                            key={s}
                            className={`btn btn-sm ${order.status === s ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => updateOrderStatus(order.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm('Delete this order?')) {
                          deleteOrder(order.id);
                        }
                      }}
                    >
                      🗑 Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
