const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book an event directly
exports.bookEvent = async (req, res) => {
  const { eventId } = req.body;
  console.log('bookEvent called by user:', req.user?._id, 'eventId:', eventId);

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.availableSeats <= 0)
      return res.status(400).json({ message: 'No seats available for this event.' });

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    if (existingBooking)
      return res.status(400).json({ message: 'You have already booked this event.' });

    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      amount: event.price,
      startDate: event.date,
      endDate: event.date,
      status: 'pending',
    });

    event.availableSeats -= 1;
    event.bookedSeats = (event.bookedSeats || 0) + 1;
    event.ticketsSold += 1;
    await event.save();

    console.log('Booking saved:', booking._id);
    res.status(201).json({ message: 'Booking successful!', booking });
  } catch (error) {
    console.error('bookEvent error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('eventId', 'title date time venue location imageUrl price')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('getUserBookings error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title date venue');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('getAllBookings error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('eventId', 'title date venue');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Confirm booking (admin)
exports.confirmBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({ message: 'Booking confirmed.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
