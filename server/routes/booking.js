const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  bookEvent,
  getAllBookings,
  getUserBookings,
  getBookingById,
  confirmBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');

// IMPORTANT: /my must be before /:id to avoid Express treating "my" as an ObjectId
router.post('/', protect, bookEvent);
router.get('/my', protect, getUserBookings);         // user's own bookings
router.get('/', protect, admin, getAllBookings);      // all bookings (admin)
router.get('/:id', protect, getBookingById);
router.put('/:id/confirm', protect, admin, confirmBookingStatus);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
