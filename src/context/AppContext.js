import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const initialMenuItems = [
  { id: uuidv4(), name: 'Margherita Pizza', category: 'Pizza', price: 199, rating: 4.8, reviewCount: 234, deliveryTime: '20-30 min', prepTime: '20-25 min', emoji: '🍕', description: 'Classic tomato base with fresh mozzarella and basil', available: true, popular: true },
  { id: uuidv4(), name: 'Pepperoni Pizza', category: 'Pizza', price: 249, rating: 4.7, reviewCount: 189, deliveryTime: '20-30 min', prepTime: '20-25 min', emoji: '🍕', description: 'Loaded with spicy pepperoni and melted cheese', available: true, popular: true },
  { id: uuidv4(), name: 'BBQ Chicken Burger', category: 'Burgers', price: 179, rating: 4.6, reviewCount: 156, deliveryTime: '15-25 min', prepTime: '15-18 min', emoji: '🍔', description: 'Grilled chicken with smoky BBQ sauce and crispy slaw', available: true, popular: true },
  { id: uuidv4(), name: 'Classic Cheeseburger', category: 'Burgers', price: 149, rating: 4.5, reviewCount: 312, deliveryTime: '15-25 min', prepTime: '12-15 min', emoji: '🍔', description: 'Beef patty with cheddar, lettuce, tomato and pickles', available: true, popular: false },
  { id: uuidv4(), name: 'Chicken Tacos', category: 'Mexican', price: 169, rating: 4.4, reviewCount: 98, deliveryTime: '20-30 min', prepTime: '15-20 min', emoji: '🌮', description: 'Three soft tacos with grilled chicken and fresh salsa', available: true, popular: false },
  { id: uuidv4(), name: 'Beef Burrito', category: 'Mexican', price: 199, rating: 4.6, reviewCount: 145, deliveryTime: '20-30 min', prepTime: '15-18 min', emoji: '🌯', description: 'Stuffed with seasoned beef, rice, beans and guacamole', available: true, popular: true },
  { id: uuidv4(), name: 'Pad Thai', category: 'Asian', price: 219, rating: 4.7, reviewCount: 203, deliveryTime: '25-35 min', prepTime: '20-25 min', emoji: '🍜', description: 'Stir-fried noodles with shrimp, peanuts and lime', available: true, popular: false },
  { id: uuidv4(), name: 'Sushi Platter', category: 'Asian', price: 349, rating: 4.9, reviewCount: 276, deliveryTime: '30-45 min', prepTime: '25-30 min', emoji: '🍣', description: '12-piece assorted sushi with wasabi and pickled ginger', available: true, popular: true },
  { id: uuidv4(), name: 'Caesar Salad', category: 'Salads', price: 149, rating: 4.3, reviewCount: 67, deliveryTime: '15-25 min', prepTime: '10-12 min', emoji: '🥗', description: 'Romaine, parmesan, croutons with house Caesar dressing', available: true, popular: false },
  { id: uuidv4(), name: 'Grilled Salmon', category: 'Healthy', price: 299, rating: 4.8, reviewCount: 124, deliveryTime: '30-40 min', prepTime: '25-30 min', emoji: '🐟', description: 'Atlantic salmon with lemon butter and steamed veggies', available: true, popular: false },
  { id: uuidv4(), name: 'Fries & Dip', category: 'Sides', price: 99, rating: 4.2, reviewCount: 340, deliveryTime: '15-20 min', prepTime: '8-10 min', emoji: '🍟', description: 'Golden crispy fries with your choice of dipping sauce', available: true, popular: false },
  { id: uuidv4(), name: 'Chocolate Lava Cake', category: 'Desserts', price: 129, rating: 4.9, reviewCount: 287, deliveryTime: '20-30 min', prepTime: '15-18 min', emoji: '🍫', description: 'Warm chocolate cake with a gooey molten center', available: true, popular: true },
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('fd-theme') || 'dark');
  const [menuItems, setMenuItems] = useState(() => {
    const version = localStorage.getItem('fd-menu-version');
    if (version !== '3') {
      localStorage.removeItem('fd-menu');
      localStorage.setItem('fd-menu-version', '3');
      return initialMenuItems;
    }
    const saved = localStorage.getItem('fd-menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fd-orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState(null);
  const [cartAnimTrigger, setCartAnimTrigger] = useState(0);
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('fd-favourites');
    return saved ? JSON.parse(saved) : [];
  });
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    return localStorage.getItem('fd-address') || '';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fd-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fd-menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('fd-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fd-favourites', JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem('fd-address', deliveryAddress);
  }, [deliveryAddress]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Cart CRUD
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) {
        showNotification(`${item.name} quantity updated`);
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      showNotification(`${item.name} added to cart 🛒`);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartAnimTrigger(prev => prev + 1);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const updateCartQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // Menu CRUD
  const addMenuItem = (item) => {
    const newItem = { ...item, id: uuidv4(), rating: 4.5, reviewCount: 0, deliveryTime: '25-35 min', available: true, popular: false };
    setMenuItems(prev => [...prev, newItem]);
    showNotification(`"${item.name}" added to menu ✅`);
  };

  const updateMenuItem = (id, updates) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showNotification('Menu item updated ✅');
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    setCart(prev => prev.filter(c => c.id !== id));
    showNotification('Item removed from menu');
  };

  const toggleAvailability = (id) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
  };

  // Favourites
  const toggleFavourite = (id) => {
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const isFavourite = (id) => favourites.includes(id);

  // Orders
  const placeOrder = (deliveryInfo) => {
    const order = {
      id: uuidv4(),
      items: [...cart],
      total: cartTotal,
      deliveryInfo,
      status: 'Preparing',
      placedAt: new Date().toISOString(),
      estimatedDelivery: `${25 + Math.floor(Math.random() * 15)}-${40 + Math.floor(Math.random() * 10)} min`,
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    showNotification('Order placed successfully! 🎉');
    return order.id;
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showNotification(`Order status updated to "${status}"`);
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showNotification('Order deleted');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      cartAnimTrigger,
      favourites, toggleFavourite, isFavourite,
      deliveryAddress, setDeliveryAddress,
      orders, placeOrder, updateOrderStatus, deleteOrder,
      notification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
