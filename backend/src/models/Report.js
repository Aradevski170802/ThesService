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
    address: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Finished'],
      default: 'Pending'
    },
    photos: [{ type: mongoose.Schema.Types.ObjectId }],
    anonymous: { type: Boolean, default: false },
    emergency: { type: Boolean, default: false },
    createdBy: { type: String, default: 'anonymous' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
