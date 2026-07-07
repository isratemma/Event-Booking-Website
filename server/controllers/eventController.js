const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getAllEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.location) {
      filters.location = req.query.location;
    }
    if (req.query.price) {
      filters.price = { $lte: req.query.price };
    }
    if (req.query.date) {
      const date = new Date(req.query.date);
      filters.date = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    const events = await Event.find(filters);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, price, availableSeats, location, imageUrl, category } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      price,
      availableSeats,
      location,
      imageUrl,
      category,
      organizer: req.user._id,
      totalSeats: availableSeats
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });

    }

    const { title, description, date, time, venue, price, availableSeats, location, imageUrl, category } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.price = price || event.price;
    event.availableSeats = availableSeats || event.availableSeats;
    event.location = location || event.location;
    event.imageUrl = imageUrl || event.imageUrl;
    event.category = category || event.category;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
   


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
