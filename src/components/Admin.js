import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Admin.css';

const CATEGORIES = ['Pizza', 'Burgers', 'Asian', 'Mexican', 'Salads', 'Healthy', 'Sides', 'Desserts'];
const EMOJIS = ['🍕', '🍔', '🍜', '🌮', '🌯', '🍣', '🥗', '🍟', '🐟', '🫔', '🍫', '🥩', '🍛', '🥘', '🥪'];

const emptyForm = {
  name: '', category: 'Pizza', price: '', emoji: '🍕',
  description: '', prepTime: '', popular: false,
};

export default function Admin() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, orders } = useApp();
  const [activeTab, setActiveTab] = useState('menu');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  const stats = {
    totalItems: menuItems.length,
    available: menuItems.filter(m => m.available).length,
    totalOrders: orders.length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
    popular: menuItems.filter(m => m.popular).length,
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.prepTime.trim()) e.prepTime = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      emoji: item.emoji,
      description: item.description,
      prepTime: item.prepTime,
      popular: item.popular,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = { ...form, price: parseFloat(form.price) };
    if (editItem) {
      updateMenuItem(editItem.id, data);
    } else {
      addMenuItem(data);
    }
    setShowForm(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.name}" from the menu?`)) {
      deleteMenuItem(item.id);
    }
  };

  const filteredItems = menuItems.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Manage your menu and track orders</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card card">
          <div className="stat-icon">🍽️</div>
          <div>
            <div className="stat-value">{stats.totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-value">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📦</div>
          <div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Orders</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-value">₹{stats.revenue.toFixed(0)}</div>
            <div className="stat-label">Revenue</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🔥</div>
          <div>
            <div className="stat-value">{stats.popular}</div>
            <div className="stat-label">Popular</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          🍽️ Menu Items ({menuItems.length})
        </button>
        <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 Orders ({orders.length})
        </button>
      </div>

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div>
          <div className="admin-toolbar">
            <input
              className="form-input"
              style={{ maxWidth: '300px' }}
              placeholder="🔍 Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={openAdd}>
              + Add New Item
            </button>
          </div>

          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Prep Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-item-cell">
                        <span className="table-emoji">{item.emoji}</span>
                        <div>
                          <div className="table-item-name">{item.name}</div>
                          {item.popular && <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>🔥 Popular</span>}
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-muted">{item.category}</span></td>
                    <td><strong>₹{item.price.toFixed(0)}</strong></td>
                    <td><span className="stars">★ {item.rating}</span></td>
                    <td>{item.prepTime}</td>
                    <td>
                      <button
                        className={`toggle-btn ${item.available ? 'available' : 'unavailable'}`}
                        onClick={() => toggleAvailability(item.id)}
                        title="Click to toggle"
                      >
                        {item.available ? '● Available' : '○ Unavailable'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="empty-state" style={{ padding: '40px' }}>
                <div className="empty-icon">🔍</div>
                <h3>No items found</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders yet</h3>
            </div>
          ) : (
            <div className="admin-table-wrap card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <code className="order-id-code">#{order.id.split('-')[0].toUpperCase()}</code>
                      </td>
                      <td>
                        <div>{order.deliveryInfo.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.deliveryInfo.phone}</div>
                      </td>
                      <td>
                        <div className="order-emojis-small">
                          {order.items.map((item, i) => (
                            <span key={i} title={item.name}>{item.emoji}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {order.items.reduce((s, i) => s + i.qty, 0)} items
                        </div>
                      </td>
                      <td><strong>₹{order.total.toFixed(0)}</strong></td>
                      <td>
                        <span className={`status-pill status-${order.status}`}>{order.status}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(order.placedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="item-form">
              {/* Emoji picker */}
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="emoji-picker">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      className={`emoji-opt ${form.emoji === e ? 'selected' : ''}`}
                      onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Item Name *</label>
                  <input
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Pepperoni Pizza"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    className={`form-input ${errors.price ? 'input-error' : ''}`}
                    type="number"
                    step="1"
                    min="0"
                    placeholder="199"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  />
                  {errors.price && <span className="error-msg">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Prep Time *</label>
                  <input
                    className={`form-input ${errors.prepTime ? 'input-error' : ''}`}
                    placeholder="20-25 min"
                    value={form.prepTime}
                    onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))}
                  />
                  {errors.prepTime && <span className="error-msg">{errors.prepTime}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-input ${errors.description ? 'input-error' : ''}`}
                  placeholder="Short description of the dish..."
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
                {errors.description && <span className="error-msg">{errors.description}</span>}
              </div>

              <label className="popular-check">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))}
                />
                <span>🔥 Mark as Popular</span>
              </label>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editItem ? '✅ Save Changes' : '✅ Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
