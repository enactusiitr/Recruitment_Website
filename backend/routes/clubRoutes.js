const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');

// Normalize a date-like value to the end of that calendar day (23:59:59.999 local time)
const toEndOfDay = (value) => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  date.setHours(23, 59, 59, 999);
  return date;
};

// Get all clubs with optional filters - only show clubs with active recruitments
router.get('/', async (req, res) => {
  try {
    const { category, isRecruiting, search, showAll, includeInactive } = req.query;
    
    // If showAll is true, show all clubs from User records (for dropdowns/filters)
    // Otherwise, only show clubs with active recruitments from Club collection
    if (showAll === 'true') {
      // Get unique club names from club admins
      const clubAdmins = await User.find({ 
        role: 'clubadmin',
        club: { $exists: true, $ne: '' }
      }).select('club');
      
      const uniqueClubNames = [...new Set(clubAdmins.map(admin => admin.club))];
      const clubs = uniqueClubNames.map(clubName => ({
        _id: clubName,
        name: clubName,
        category: 'Technical Club',
        isRecruiting: false,
        description: `Join ${clubName}`,
        requirements: '',
        recruitmentDeadline: null
      }));
      
      return res.json(clubs);
    }
    
    // Default: Only fetch clubs that have active recruitments from Club collection
    // Unless includeInactive is true, then fetch all clubs
    let filter = {};
    
    if (includeInactive !== 'true') {
      filter.isRecruiting = true;
    }
    
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const clubs = await Club.find(filter).sort({ name: 1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single club
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create club
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Validate required fields
    if (!payload.name) {
      return res.status(400).json({ message: 'Club name is required' });
    }
    if (!payload.description) {
      return res.status(400).json({ message: 'Club description is required' });
    }
    if (!payload.contactEmail) {
      return res.status(400).json({ message: 'Contact email is required' });
    }
    
    if (payload.recruitmentDeadline) {
      payload.recruitmentDeadline = toEndOfDay(payload.recruitmentDeadline);
    }

    const club = new Club(payload);
    const savedClub = await club.save();
    res.status(201).json(savedClub);
  } catch (error) {
    console.error('Error creating club:', error);
    
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const clubName = error.keyValue?.name || 'Unknown';
      return res.status(400).json({ 
        message: `Club "${clubName}" already exists. Please update the existing club instead of creating a new one.` 
      });
    }
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update club
router.put('/:id', async (req, res) => {
  try {
    const clubIdentifier = req.params.id;
    const payload = { ...req.body };
    if (payload.recruitmentDeadline) {
      payload.recruitmentDeadline = toEndOfDay(payload.recruitmentDeadline);
    }
    let club;
    
    // Try to find by ObjectId first, then by name
    if (clubIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findByIdAndUpdate(
        clubIdentifier,
        payload,
        { new: true }
      );
    } else {
      // Find by name and update, or create if doesn't exist
      club = await Club.findOneAndUpdate(
        { name: clubIdentifier },
        payload,
        { new: true, upsert: true }
      );
    }
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete club (turn off recruitment)
router.delete('/:id', async (req, res) => {
  try {
    const clubIdentifier = req.params.id;
    let club;
    
    // Try to find by ObjectId first, then by name
    if (clubIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findByIdAndUpdate(
        clubIdentifier,
        { isRecruiting: false },
        { new: true }
      );
    } else {
      // Find by name and set isRecruiting to false
      club = await Club.findOneAndUpdate(
        { name: clubIdentifier },
        { isRecruiting: false },
        { new: true }
      );
    }
    
    if (!club) {
      // If club doesn't exist in Club collection, just return success
      return res.json({ message: 'Recruitment deleted successfully' });
    }
    
    res.json({ message: 'Recruitment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
