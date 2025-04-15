const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: {
      type: {
        lat: { type: Number },
        lon: { type: Number },
      },
    },
    photos: [
      {
        data: Buffer,        // Store the binary data of the image
        contentType: String, // Store the MIME type of the image
      },
    ],
    anonymous: { type: Boolean, default: false },
    emergency: { type: Boolean, default: false },
    createdBy: { type: String, required: true }, // In your case 'anonymous' for now
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
