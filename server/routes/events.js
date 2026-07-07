const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController.js');

// Public route to get all events
router.get('/', getAllEvents);
  

// Protected route to create a new event (admin only)
router.post('/', protect, admin, createEvent);

// Public route to get a specific event by ID
router.get('/:id', getEventById);

// Protected route to update an event (admin only)
router.put('/:id', protect, admin, updateEvent);

// Protected route to delete an event (admin only)
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;