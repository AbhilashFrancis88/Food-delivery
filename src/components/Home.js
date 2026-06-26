import React from 'react';
import { Link } from 'react-router-dom';
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

export default function Home() {
  const { menuItems, addToCart } = useApp();
  const popular = menuItems.filter(m => m.popular && m.available).slice(0, 4);

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
              <div className="popular-emoji">{item.emoji}</div>
              <div className="popular-info">
                <div className="popular-top">
                  <h3>{item.name}</h3>
                  <span className="badge badge-accent">{item.category}</span>
                </div>
                <p className="popular-desc">{item.description}</p>
                <div className="popular-meta">
                  <span className="stars">{'★'.repeat(Math.round(item.rating))} <span className="rating-num">{item.rating}</span></span>
                  <span className="prep-time">⏱ {item.prepTime}</span>
                </div>
                <div className="popular-footer">
                  <span className="price">₹{item.price.toFixed(0)}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>
                    + Add
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
