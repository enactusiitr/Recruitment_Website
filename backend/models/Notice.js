const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Recruitment', 'Event', 'Announcement'],
    default: 'General'
  },
  clubName: {
    type: String,
    enum: ['Enactus', 'E-Cell', 'PAG', 'ACM', 'RMS', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String
  }],
  prizes: {
    type: Number
  },
  teamSize: {
    type: String
  },
  location: {
    type: String
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  daysLeft: {
    type: Number
  },
  status: {
    type: String,
    enum: ['live', 'expired', 'closed', 'recent'],
    default: 'live'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
