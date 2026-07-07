const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://EventVenue:EventVenue@cluster0.l7zck31.mongodb.net/EventVenue?appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "eventvenue_super_secret_key_2026";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://event-booking-website-57ok.vercel.app";

// Make available globally
process.env.JWT_SECRET = JWT_SECRET;

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/booking.js');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

console.log('Connecting to MongoDB...');
console.log('URI prefix:', MONGODB_URI.substring(0, 25));

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
