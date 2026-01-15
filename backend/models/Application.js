const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['club', 'event'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  whatsappNo: {
    type: String,
    required: false
  },
  // Keep phone for backward compatibility
  phone: {
    type: String,
    required: false
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  enrollmentNo: {
    type: String,
    required: false
  },
  // Keep rollNumber for backward compatibility
  rollNumber: {
    type: String,
    required: false
  },
  driveLink: {
    type: String,
    default: ''
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
