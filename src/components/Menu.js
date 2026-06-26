import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Menu.css';

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Asian', 'Mexican', 'Salads', 'Healthy', 'Sides', 'Desserts'];

export default function Menu() {
  const { menuItems, addToCart, cart } = useApp();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultCat = params.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(defaultCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('category');
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  const filtered = useMemo(() => {
    let items = menuItems.filter(m => m.available);
    if (activeCategory !== 'All') items = items.filter(m => m.category === activeCategory);
    if (search) items = items.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'popular') items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return items;
  }, [menuItems, activeCategory, search, sortBy]);

  const getCartQty = (id) => {
    const c = cart.find(c => c.id === id);
    return c ? c.qty : 0;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Our Menu</h1>
        <p>Fresh, delicious food made to order</p>
      </div>

      {/* Controls */}
      <div className="menu-controls">
        <input
          className="form-input search-input"
          placeholder="🔍 Search dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="popular">Popular first</option>
          <option value="rating">Highest rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="results-count">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No items found</h3>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map(item => {
            const inCart = getCartQty(item.id);
            return (
              <div key={item.id} className="menu-card card fade-in">
                <div className="menu-card-emoji">
                  {item.emoji}
                  {item.popular && <span className="popular-tag">🔥 Popular</span>}
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <span className="badge badge-muted">{item.category}</span>
                  </div>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-meta">
                    <span className="stars">{'★'.repeat(Math.round(item.rating))} {item.rating}</span>
                    <span className="prep-time">⏱ {item.prepTime}</span>
                  </div>
                  <div className="menu-card-footer">
                    <span className="price">₹{item.price.toFixed(0)}</span>
                    <button
                      className={`btn btn-primary btn-sm add-btn ${inCart > 0 ? 'in-cart' : ''}`}
                      onClick={() => addToCart(item)}
                    >
                      {inCart > 0 ? `✓ In cart (${inCart})` : '+ Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
