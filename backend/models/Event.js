const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  clubName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  submissionDeadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  prizes: {
    type: String
  },
  rules: {
    type: String
  },
  registrationFormLink: {
    type: String,
    default: ''
  },
  submissionFormLink: {
    type: String,
    default: ''
  }
  ,
  registrationResponseLink: {
    type: String,
    default: ''
  },
  submissionResponseLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
