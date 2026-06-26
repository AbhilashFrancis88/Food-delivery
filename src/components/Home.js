import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', color: '#FF6B35' },
  { name: 'Burgers', emoji: '🍔', color: '#FFB800' },
  { name: 'Asian', emoji: '🍜', color: '#E83E8C' },
  { name: 'Mexican', emoji: '🌮', color: '#28A745' },
  { name: 'Salads', emoji: '🥗', color: '#17A2B8' },
  { name: 'Desserts', emoji: '🍫', color: '#6F42C1' },
];

const PROMOS = [
  { headline: '50% OFF up to ₹100', sub: 'Use code RUSH50', emoji: '🎁', color: '#FF6B35' },
  { headline: 'Free Delivery', sub: 'On orders above ₹299', emoji: '🚚', color: '#28A745' },
  { headline: 'Buy 1 Get 1 Free', sub: 'Use code BOGO', emoji: '🍕', color: '#6F42C1' },
  { headline: '₹75 Cashback', sub: 'Pay via UPI', emoji: '💸', color: '#DC3545' },
];

export default function Home() {
  const { menuItems, addToCart, isFavourite, toggleFavourite } = useApp();
  const navigate = useNavigate();
  const popular = menuItems.filter(m => m.popular && m.available).slice(0, 4);
  const [heroSearch, setHeroSearch] = useState('');
  const [addedItems, setAddedItems] = useState({});

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1000);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Fast delivery · 30 min avg</div>
          <h1 className="hero-title">
            Great food,<br />
            <span className="hero-accent">delivered fast.</span>
          </h1>
          <p className="hero-subtitle">
            Explore hundreds of dishes from top restaurants. Fresh, hot, and at your door.
          </p>
          <form className="hero-search" onSubmit={handleHeroSearch}>
            <input
              className="hero-search-input"
              placeholder="🔍 Search for dishes..."
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary btn-lg">
              Browse Menu →
            </Link>
            <Link to="/orders" className="btn btn-secondary btn-lg">
              Track Order
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>50+</strong>
              <span>Dishes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>4.8★</strong>
              <span>Rating</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>30 min</strong>
              <span>Avg. delivery</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-plate">
            <span className="plate-emoji">🍕</span>
            <div className="plate-ring ring1"></div>
            <div className="plate-ring ring2"></div>
            <div className="plate-ring ring3"></div>
          </div>
          <div className="float-card card1">🍔 Burger · ₹179</div>
          <div className="float-card card2">⏱️ 20 min delivery</div>
          <div className="float-card card3">🌮 Tacos · ₹169</div>
        </div>
      </section>

      {/* Promo Banner Strip */}
      <section className="promo-strip-section">
        <div className="promo-strip">
          <div className="promo-track">
            {[...PROMOS, ...PROMOS].map((promo, i) => (
              <div key={i} className="promo-offer-card" style={{ backgroundColor: promo.color }}>
                <span className="promo-offer-emoji">{promo.emoji}</span>
                <div className="promo-offer-text">
                  <h4>{promo.headline}</h4>
                  <p>{promo.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <Link to="/menu" className="see-all">See all →</Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/menu?category=${cat.name}`}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="section">
        <div className="section-header">
          <h2>🔥 Popular Right Now</h2>
          <Link to="/menu" className="see-all">See all →</Link>
        </div>
        <div className="popular-grid">
          {popular.map(item => (
            <div key={item.id} className="popular-card card">
              <div className="popular-emoji">
                {item.emoji}
                <button
                  className={`fav-btn ${isFavourite(item.id) ? 'fav-active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavourite(item.id); }}
                  title="Toggle favourite"
                >
                  {isFavourite(item.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="popular-info">
                <div className="popular-top">
                  <h3>{item.name}</h3>
                  <span className="badge badge-accent">{item.category}</span>
                </div>
                <div className="card-rating-row">
                  <span className="stars">⭐ <strong>{item.rating}</strong></span>
                  <span className="review-count">({item.reviewCount} reviews)</span>
                </div>
                <p className="popular-desc">{item.description}</p>
                <div className="popular-meta">
                  <span className="delivery-badge-inline">🕐 {item.deliveryTime}</span>
                  <span className="prep-time">⏱ {item.prepTime}</span>
                </div>
                <div className="popular-footer">
                  <span className="price">₹{item.price.toFixed(0)}</span>
                  <button
                    className={`btn btn-primary btn-sm ${addedItems[item.id] ? 'added-btn' : ''}`}
                    onClick={() => handleAdd(item)}
                  >
                    {addedItems[item.id] ? 'Added ✓' : '+ Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>First order? Get 20% off!</h2>
          <p>Use code <strong>FIRST20</strong> at checkout</p>
          <Link to="/menu" className="btn btn-primary">Order Now →</Link>
        </div>
        <div className="promo-emoji">🎉</div>
      </section>
    </div>
  );
}
