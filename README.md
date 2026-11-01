# Roxiler's - Store Rating Application 🏪

A full-stack web application that allows users to browse stores and submit ratings, store owners to monitor their store performance, and system admins to manage the entire platform.

![React](https://img.shields.io/badge/React-19-blue)
![NodeJS](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-grey)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![JWT](https://img.shields.io/badge/JWT-blue)
![Bcrypt](https://img.shields.io/badge/Bcrypt-yellow)

---

## Tech Stack :

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Axios, Vite |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MySQL 8.0 |
| **Auth** | JWT + bcrypt |

---

## Features :

### 🔐 Authentication -
- User signup & login with JWT-based authentication.
- Role-based access control (RBAC) with three roles.
- Password update support.

### 👤 Normal User -
- Browse all registered stores.
- Submit or update a rating (1–5 stars) for any store.

### 🏪 Store Owner -
- View own store dashboard with average rating and individual ratings from users.

### 🛡️ System Admin -
- View platform-wide dashboard stats (total users, stores, ratings).
- List and search all users.
- Add new users with any role.

---

## Project Structure :

```
Roxiler-Coding-Challenge/
├── backend/                   # Express.js API server
│   ├── config/db.js           # MySQL connection pool (mysql2)
│   ├── controllers/           # Business logic (auth, admin, store, ratings)
│   ├── middleware/            # JWT auth & role-based access middleware
│   ├── routes/                # API route definitions
│   └── index.js               # Server entry point (PORT 3000)
│
├── frontend/                  # React + Vite SPA
│   └── src/
│       ├── config/api.js      # API base URL config
│       ├── pages/             # Login, Signup, Admin/Owner/User Dashboards
│       └── App.jsx            # Root component with routing
│
├── schema.sql                 # MySQL schema, triggers & seed data
└── guide.txt                  # Detailed setup guide
```

---

## API Endpoints :

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login & receive JWT |
| `PUT` | `/api/auth/update-password` | Any | Update own password |
| `GET` | `/api/admin/dashboard/stats` | Admin | Platform-wide stats |
| `GET` | `/api/admin/users` | Admin | List all users |
| `POST` | `/api/admin/users` | Admin | Create a new user |
| `GET` | `/api/stores` | Any | List all stores |
| `POST` | `/api/stores` | Any | Add a new store |
| `POST` | `/api/ratings` | Normal User | Submit/update a rating |
| `GET` | `/api/owner/dashboard` | Store Owner | Owner's store stats |

---

## Database Schema :

- **`users`** — Stores user accounts with name, email, hashed password, address, and role (`SYSTEM_ADMIN`, `STORE_OWNER`, `NORMAL_USER`)
- **`stores`** — Stores registered with name, email, address, and an optional owner reference
- **`ratings`** — One rating per user per store (1–5); unique constraint on `(user_id, store_id)`
- **`audit_logs`** — Auto-populated via MySQL triggers on INSERT/UPDATE/DELETE for all three tables

---

## Getting Started :

### Prerequisites -

- Node.js v18+
- MySQL Server v8.0+

### 1. Database Setup -

```bash
mysql -u root -p < schema.sql
```

### 2. Backend -

```bash
cd backend
npm install
npm start
```

> Backend runs at `http://localhost:3000`

### 3. Frontend -

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## Environment Variables -

**`backend/.env`**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=db_name
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=3000
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Test Credentials -


| Role | Email | Password |
|------|-------|-------|
| System Admin | `sultan.admin@email.com` | `Sultan@12345` |
| Store Owner | `sultan.owner@email.com` | `Sultan@12345` |
| Normal User | `sultan.user@email.com` | `Sultan@12345` |
| Normal User | `sahil.user@email.com` | `Sahil@12345` |

