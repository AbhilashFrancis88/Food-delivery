import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Menu.css';

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Asian', 'Mexican', 'Salads', 'Healthy', 'Sides', 'Desserts'];

export default function Menu() {
  const { menuItems, addToCart, cart, isFavourite, toggleFavourite } = useApp();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultCat = params.get('category') || 'All';
  const defaultSearch = params.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(defaultCat);
  const [searchInput, setSearchInput] = useState(defaultSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(defaultSearch);
  const [sortBy, setSortBy] = useState('popular');
  const [addedItems, setAddedItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('category');
    if (cat) setActiveCategory(cat);
    const search = new URLSearchParams(location.search).get('search');
    if (search) {
      setSearchInput(search);
      setDebouncedSearch(search);
    }
  }, [location.search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filtered = useMemo(() => {
    let items = menuItems.filter(m => m.available);
    if (activeCategory !== 'All') items = items.filter(m => m.category === activeCategory);
    if (debouncedSearch) items = items.filter(m =>
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'popular') items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return items;
  }, [menuItems, activeCategory, debouncedSearch, sortBy]);

  const getCartQty = (id) => {
    const c = cart.find(c => c.id === id);
    return c ? c.qty : 0;
  };

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1000);
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
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
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
      {loading ? (
        <div className="skeleton-tabs">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-tab shimmer"></div>
          ))}
        </div>
      ) : (
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
      )}

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="menu-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image shimmer"></div>
              <div className="skeleton-body">
                <div className="skeleton-line shimmer" style={{ width: '70%' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '100%' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '50%' }}></div>
                <div className="skeleton-line-short shimmer" style={{ width: '30%' }}></div>
                <div className="skeleton-btn shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results for &ldquo;{debouncedSearch}&rdquo;</h3>
          <p>Try a different search or category</p>
          {debouncedSearch && (
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => { setSearchInput(''); setDebouncedSearch(''); }}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map(item => {
            const inCart = getCartQty(item.id);
            const justAdded = addedItems[item.id];
            return (
              <div key={item.id} className="menu-card card fade-in">
                <div className="menu-card-emoji">
                  {item.emoji}
                  {item.popular && <span className="popular-tag">🔥 Popular</span>}
                  <button
                    className={`fav-btn-card ${isFavourite(item.id) ? 'fav-active' : ''}`}
                    onClick={() => toggleFavourite(item.id)}
                    title="Toggle favourite"
                  >
                    {isFavourite(item.id) ? '❤️' : '🤍'}
                  </button>
                  <span className="delivery-badge-card">🕐 {item.deliveryTime}</span>
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <span className="badge badge-muted">{item.category}</span>
                  </div>
                  <div className="card-rating-row">
                    <span className="stars">⭐ <strong>{item.rating}</strong></span>
                    <span className="review-count">({item.reviewCount} reviews)</span>
                  </div>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-meta">
                    <span className="prep-time">⏱ {item.prepTime}</span>
                  </div>
                  <div className="menu-card-footer">
                    <span className="price">₹{item.price.toFixed(0)}</span>
                    <button
                      className={`btn btn-primary btn-sm add-btn ${justAdded ? 'added-btn' : inCart > 0 ? 'in-cart' : ''}`}
                      onClick={() => handleAdd(item)}
                    >
                      {justAdded ? 'Added ✓' : inCart > 0 ? `✓ In cart (${inCart})` : '+ Add to cart'}
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
