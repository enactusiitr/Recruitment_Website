const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Normalize a date-like value to the end of that calendar day (23:59:59.999 local time)
const toEndOfDay = (value) => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  date.setHours(23, 59, 59, 999);
  return date;
};

// Get all events with optional filters
router.get('/', async (req, res) => {
  try {
    const { clubName, isActive, search } = req.query;
    let filter = {};

    if (clubName) filter.clubName = clubName;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { problemStatement: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter).sort({ eventDate: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.registrationDeadline) {
      payload.registrationDeadline = toEndOfDay(payload.registrationDeadline);
    }
    if (payload.submissionDeadline) {
      payload.submissionDeadline = toEndOfDay(payload.submissionDeadline);
    }

    const event = new Event(payload);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.registrationDeadline) {
      payload.registrationDeadline = toEndOfDay(payload.registrationDeadline);
    }
    if (payload.submissionDeadline) {
      payload.submissionDeadline = toEndOfDay(payload.submissionDeadline);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
