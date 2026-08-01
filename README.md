<h1 align="center">🛍️ Bazaar — Full Stack E-Commerce Platform</h1>

<p align="center">
  A modern, full-featured e-commerce web application built with React, Node.js, Express, and MongoDB.
</p>

<p align="center">
  <a href="https://bazaar-235b.vercel.app/collection" target="_blank">
    <img src="https://img.shields.io/badge/User%20Frontend-Live-brightgreen?style=for-the-badge&logo=vercel" alt="Frontend Live" />
  </a>
  &nbsp;
  <a href="https://bazaar-admin-alpha.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Admin%20Dashboard-Live-blue?style=for-the-badge&logo=vercel" alt="Admin Live" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render" alt="Backend Render" />
</p>

---

## 🔗 Live Demo

| App | URL |
|-----|-----|
| 🛒 **User Frontend** | [https://bazaar-235b.vercel.app/collection](https://bazaar-d5d.pages.dev/) |

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)

---

## 🧭 Overview

**Bazaar** is a complete e-commerce solution consisting of three independent applications:

- **Frontend** — The customer-facing shopping experience
- **Admin** — A secure dashboard for managing products, orders, and inventory
- **Backend** — A RESTful API server powering both applications

---

## ✨ Features

### 🛍️ User Frontend
- Browse and filter products by category, price, and search query
- Detailed product pages with image galleries and size selection
- Shopping cart with quantity management
- Secure checkout with **Stripe** and **Razorpay** payment gateways
- User authentication (register / login / JWT sessions)
- Order history and tracking

### 🔧 Admin Dashboard
- Secure admin-only login
- Add new products with image uploads (powered by **Cloudinary**)
- View and manage all products (list / delete)
- View and update order statuses

### ⚙️ Backend API
- RESTful API with Express 5
- MongoDB database with Mongoose ODM
- JWT-based authentication and authorization
- Image uploads via Multer + Cloudinary
- Input validation with Zod
- Layered architecture: Routes → Controllers → Services → Repositories

---

## 🛠️ Tech Stack

### Frontend & Admin
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | 8 | Build Tool |
| TailwindCSS | 4 | Styling |
| React Router | 7 | Client-side Routing |
| Axios | 1.18 | HTTP Client |
| React Toastify | 11 | Notifications |
| Swiper | 12 | Image Carousels |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | — | Runtime |
| Express | 5 | Web Framework |
| MongoDB + Mongoose | 9 | Database & ODM |
| JWT | 9 | Authentication |
| Bcrypt | 6 | Password Hashing |
| Cloudinary | 1.41 | Image Storage |
| Multer | 2 | File Uploads |
| Stripe | 22 | Payment Gateway |
| Razorpay | 2.9 | Payment Gateway |
| Zod | 4 | Input Validation |

---

## 📁 Project Structure

```
E_Commerce_App/
│
├── Frontend/               # User-facing React app
│   ├── src/
│   │   ├── pages/          # Home, Collection, ProductDetail, Cart,
│   │   │                   # PlaceOrder, Orders, Login, About, Contacts
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # ShopContext (global state)
│   │   └── assets/         # Images and static files
│   ├── vercel.json         # SPA routing config for Vercel
│   └── vite.config.js
│
├── Admin/                  # Admin dashboard React app
│   ├── src/
│   │   ├── pages/          # Add, List, Orders
│   │   ├── components/     # Navbar, Sidebar, etc.
│   │   └── assets/
│   ├── vercel.json         # SPA routing config for Vercel
│   └── vite.config.js
│
└── Backend/                # Express REST API
    ├── server.js           # Entry point
    ├── config/             # DB & server config
    ├── routes/             # userRoutes, productRoutes, cartRoutes, orderRoutes
    ├── controllers/        # Request handlers
    ├── services/           # Business logic
    ├── repository/         # Database access layer
    ├── middleware/         # Auth, error handling
    ├── schema/             # Mongoose models
    ├── validators/         # Zod validation schemas
    └── util/               # Utility helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe and/or Razorpay account

### Clone the repository
```bash
git clone https://github.com/your-username/E_Commerce_App.git
cd E_Commerce_App
```

### 1. Start the Backend
```bash
cd Backend
npm install
# Create a .env file (see Environment Variables section)
npm run server    # development with nodemon
# or
npm start         # production
```

### 2. Start the Frontend
```bash
cd Frontend
npm install
# Create a .env file
npm run dev
```
Runs on: `http://localhost:5173`

### 3. Start the Admin
```bash
cd Admin
npm install
# Create a .env file
npm run dev
```
Runs on: `http://localhost:5174`

---

## 🔐 Environment Variables

### Backend — `Backend/.env`
```env
PORT=3000
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUD_NAME=your_cloud_name
JWT_SECRET=your_strong_jwt_secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password
```

### Frontend — `Frontend/.env`
```env
VITE_BACKEND_SERVER=http://localhost:3000
```

### Admin — `Admin/.env`
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 📡 API Routes

### User Routes — `/api/user`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/profile` | Get user profile | 🔒 User |

### Product Routes — `/api/product`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/list` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/add` | Add new product | 🔒 Admin |
| DELETE | `/remove/:id` | Delete product | 🔒 Admin |

### Cart Routes — `/api/cart`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/add` | Add item to cart | 🔒 User |
| POST | `/update` | Update cart | 🔒 User |
| GET | `/get` | Get user cart | 🔒 User |

### Order Routes — `/api/order`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/place` | Place new order | 🔒 User |
| POST | `/stripe` | Pay via Stripe | 🔒 User |
| POST | `/razorpay` | Pay via Razorpay | 🔒 User |
| GET | `/userorders` | Get user orders | 🔒 User |
| GET | `/list` | Get all orders | 🔒 Admin |
| POST | `/status` | Update order status | 🔒 Admin |

---

## ☁️ Deployment

| Service | Platform | Config |
|---------|----------|--------|
| **Backend** | [Render](https://render.com) | Root Dir: `Backend`, Start: `npm start` |
| **Frontend** | [Vercel](https://vercel.com) | Root Dir: `Frontend`, Framework: `Vite` |
| **Admin** | [Vercel](https://vercel.com) | Root Dir: `Admin`, Framework: `Vite` |

Both Vercel apps use `vercel.json` with SPA rewrite rules to handle React Router navigation.

A cron job (via [cron-job.org](https://cron-job.org)) pings the backend every 14 minutes to prevent Render's free tier from spinning down.

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">Built with ❤️ by <strong>Suprokas Midde</strong></p>
