const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, referenceId, status } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (referenceId) filter.referenceId = referenceId;
    if (status) filter.status = status;

    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create application (Apply to club or event)
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update application (for submission or status update)
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit drive link for event
router.patch('/:id/submit', async (req, res) => {
  try {
    const { driveLink } = req.body;
    if (!driveLink) {
      return res.status(400).json({ message: 'Drive link is required' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { driveLink },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
