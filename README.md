# 🔥 FlavorRush — Food Delivery App

A fully interactive food delivery app built with **React 18** featuring dark/light theme and complete CRUD functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed ([download here](https://nodejs.org))

### Setup & Run

```bash
# 1. Navigate to the project folder
cd food-delivery-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000** 🎉

---

## ✨ Features

### 🛍️ Customer Features
- **Home Page** — Hero section, category browsing, popular items
- **Menu Page** — Filter by category, search, sort by price/rating
- **Cart** — Add/remove items, adjust quantities, apply promo codes
- **Checkout** — Delivery form with validation, order placement
- **Orders** — View all orders, expand for details, update status

### ⚙️ Admin Features
- **Dashboard stats** — Total items, orders, revenue, availability
- **Menu CRUD** — Add, edit, delete menu items
- **Availability toggle** — Enable/disable items instantly
- **Order management** — View all orders in a table

### 🎨 UI/UX
- **Dark/Light theme** — Toggle in navbar, persists across sessions
- **Responsive** — Works on mobile, tablet, and desktop
- **Animated** — Smooth transitions, floating cards, pulse effects
- **Toast notifications** — Feedback for all user actions
- **localStorage** — Cart, orders, and menu changes persist on refresh

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.js       # Global state (theme, cart, menu, orders)
├── components/
│   ├── Navbar.js / .css
│   ├── Notification.js / .css
│   ├── Home.js / .css
│   ├── Menu.js / .css
│   ├── Cart.js / .css
│   ├── Orders.js / .css
│   └── Admin.js / .css
├── App.js / .css
├── index.js
└── index.css
```

---

## 🛠️ Tech Stack

| Tool | Usage |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Context API + useState | State management |
| localStorage | Data persistence |
| CSS Variables | Dark/light theming |
| Google Fonts (Syne + Inter) | Typography |
| uuid | Unique IDs |

---

## 📦 Build for Production

```bash
npm run build
```

Outputs optimized files to the `build/` folder.
