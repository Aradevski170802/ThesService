// backend/src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: [
      'Traffic & Road Safety',
      'Public Lighting',
      'Waste Management',
      'Water & Sewage',
      'Parks & Green Spaces',
      'Public Transport',
      'Building & Structural Safety',
      'Graffiti & Vandalism',
      'Miscellaneous'
    ],
    required: true
  },
  photos: [{
    type: String,
  }],
  anonymous: {
    type: Boolean,
    default: false
  },
  emergency: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Link to the User model
  }
});

module.exports = mongoose.model('Report', reportSchema);
