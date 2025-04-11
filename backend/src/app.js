// backend/src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (use your own MongoDB URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/public_infra';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => res.send('Public Infrastructure Maintenance System API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
