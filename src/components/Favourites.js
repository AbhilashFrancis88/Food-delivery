import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Favourites.css';

export default function Favourites() {
  const { menuItems, favourites, toggleFavourite, isFavourite, addToCart, cart } = useApp();
  const [addedItems, setAddedItems] = useState({});
  const favouriteItems = menuItems.filter(m => favourites.includes(m.id));

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

  if (favouriteItems.length === 0) {
    return (
      <div className="page">
        <div className="empty-state" style={{ paddingTop: '120px' }}>
          <div className="empty-icon">❤️</div>
          <h3>No favourites yet</h3>
          <p>Browse our menu and tap the heart to save your favourites!</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Menu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>❤️ Your Favourites</h1>
        <p>{favouriteItems.length} {favouriteItems.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      <div className="fav-grid">
        {favouriteItems.map(item => {
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
                  title="Remove from favourites"
                >
                  ❤️
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
    </div>
  );
}
