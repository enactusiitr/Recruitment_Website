const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Get all notices with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, priority, clubName, search } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (clubName) filter.clubName = clubName;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single notice
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notice
router.post('/', async (req, res) => {
  try {
    const notice = new Notice(req.body);
    const savedNotice = await notice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update notice
router.put('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notice
router.delete('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
