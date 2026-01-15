const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['coding', 'robotics', 'design', 'cybersecurity', 'ai-ml', 'web-dev', 'other'],
    default: 'other'
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  isRecruiting: {
    type: Boolean,
    default: false
  },
  recruitmentDeadline: {
    type: Date
  },
  requirements: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);
