const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Event = require('../models/Event');

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submissions by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const submissions = await Submission.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create submission
router.post('/', async (req, res) => {
  try {
    const submission = new Submission(req.body);
    const newSubmission = await submission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
