const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    location: {
      type: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
      required: true,
    },
    description: { type: String, required: true },
    department: { type: String, required: true },
    photos: [String],  // Store photo paths
    anonymous: { type: Boolean, default: false },
    emergency: { type: Boolean, default: false },
    createdBy: { type: String, required: true },  // In your case 'anonymous' for now
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
