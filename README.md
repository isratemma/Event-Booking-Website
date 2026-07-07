# 🎉 EventVenue — Full Stack Event Booking Platform

A full-stack web application for discovering, browsing, and booking events. Built with React, Node.js, Express, and MongoDB.

---

## 🚀 Live Features

- 🔐 User authentication (Email/Password + Google OAuth via Firebase)
- 🎟️ Browse and book events across 7 categories
- 👤 User dashboard with booking history
- 🛡️ Admin dashboard with full event and booking management
- 📧 OTP-based email verification (via Resend)
- 🔍 Search events by title, venue, or location
- 📱 Fully responsive — mobile + desktop

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| React Router v7 | Routing |
| Axios | HTTP requests |
| Firebase | Google OAuth |
| React Icons | Icons |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js | Runtime |
| Express | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Resend | Email sending |

---

## 📁 Project Structure

```
EventVenue/
├── client/
│   └── eventvenue/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Events.jsx
│       │   │   ├── EventDetail.jsx
│       │   │   ├── Booking.jsx
│       │   │   ├── PaymentSuccess.jsx
│       │   │   ├── PaymentFailed.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   └── UsersDashboard.jsx
│       │   ├── firebase.js
│       │   └── main.jsx
│       └── vite.config.js
└── server/
    ├── controllers/
    │   ├── authController.js
    │   ├── bookingController.js
    │   └── eventController.js
    ├── models/
    │   ├── User.js
    │   ├── Event.js
    │   ├── Booking.js
    │   └── OTP.js
    ├── routes/
    │   ├── auth.js
    │   ├── booking.js
    │   └── events.js
    ├── middleware/
    │   └── auth.js
    ├── utils/
    │   └── email.js
    ├── seed.js
    └── index.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project (for Google login)
- Resend account (for emails)

---

### 1. Clone the repo

```bash
git clone https://github.com/isratemma/Event-Booking-Website.git
cd Event-Booking-Website
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=re_your_resend_api_key
```

Seed the database with sample events and users:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:5001`

---

### 3. Frontend Setup

```bash
cd client/eventvenue
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventvenue.com | password123 |
| User | emma@example.com | password123 |

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google OAuth login |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Book an event |
| GET | `/api/bookings/my` | Get current user's bookings |
| GET | `/api/bookings` | Get all bookings (admin) |
| PUT | `/api/bookings/:id/confirm` | Confirm booking (admin) |
| DELETE | `/api/bookings/:id` | Delete booking (admin) |

---

## 🎨 Color Palette

| Element | Color |
|---------|-------|
| Navbar | `#7C3AED → #6D28D9` (violet gradient) |
| Book Now button | `#FF8A00` (orange) |
| Price tags | `#22C55E` (emerald green) |
| Footer | `#1E293B` (dark navy) |

---

## 🗂️ Event Categories

- ✨ Gala
- 🎤 Conference
- 🎶 Entertainment
- 🏛️ Expo
- 💼 Corporate
- 💍 Wedding
- 🎂 Birthday

---

## 📸 Screenshots

> Home Page · Events Page · Booking Flow · Admin Dashboard · User Dashboard

---

## 🔒 Security

- Passwords hashed with **bcryptjs**
- Routes protected with **JWT middleware**
- `.env` excluded from git via `.gitignore`
- Admin-only routes protected with role-based middleware

---

## 📄 License

MIT © 2026 EventVenue
