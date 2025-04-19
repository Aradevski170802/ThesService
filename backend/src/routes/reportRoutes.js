// backend/routes/reportRoutes.js
const router = require('express').Router();
const multer = require('multer');
const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');
const authMiddleware = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Geocoder setup
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

// Mailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.replace(/\s/g, '')
  }
});

/**
 * POST /api/reports
 * - only logged‑in users
 * - reverse‑geocode, upload photos, save report
 * - email the creator a confirmation
 */
router.post(
  '/',
  authMiddleware,
  upload.array('photos', 5),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        location,
        anonymous,
        emergency
      } = req.body;

      // parse the JSON‐stringified coords
      const loc = JSON.parse(location);
      if (
        typeof loc.lat !== 'number' ||
        typeof loc.lng !== 'number'
      ) {
        return res
          .status(400)
          .json({ message: 'Invalid location format' });
      }

      // reverse‑geocode to get a human address
      const geoRes = await geocoder.reverse({
        lat: loc.lat,
        lon: loc.lng
      });
      const humanAddress =
        geoRes[0]?.formattedAddress ||
        geoRes[0]?.displayName ||
        '';

      // upload photos into GridFS
      const bucket = req.app.locals.gfsBucket;
      const photoIds = [];
      for (const file of req.files) {
        const stream = bucket.openUploadStream(
          file.originalname,
          { contentType: file.mimetype }
        );
        stream.end(file.buffer);
        await new Promise((resolve, reject) => {
          stream.on('finish', resolve);
          stream.on('error', reject);
        });
        photoIds.push(stream.id);
      }

      // save the report, stamping the creator
      const report = new Report({
        title,
        description,
        category,
        location: { lat: loc.lat, lon: loc.lng },
        address: humanAddress,
        anonymous: anonymous === 'true',
        emergency: emergency === 'true',
        photos: photoIds,
        createdBy: req.user.userId
      });
      await report.save();

      // email the creator
      const creator = await User.findById(req.user.userId);
      if (creator?.email) {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: creator.email,
          subject: '📬 Your report was received',
          html: `
            <p>Hi ${creator.name},</p>
            <p>
              We received your report titled
              "<strong>${report.title}</strong>".
            </p>
            <p>Current status: <strong>${report.status || 'Pending'}</strong></p>
            <p>Thank you for helping improve your city!</p>
          `
        }).catch(err =>
          console.error('Error sending creation email:', err)
        );
      }

      res
        .status(201)
        .json({ message: 'Report created', report });
    } catch (err) {
      console.error('Error in POST /reports:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * GET /api/reports/photo/:id
 */
router.get('/photo/:id', (req, res) => {
  try {
    const bucket = req.app.locals.gfsBucket;
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const stream = bucket.openDownloadStream(_id);
    stream.on('error', () => res.sendStatus(404));
    stream.pipe(res);
  } catch (err) {
    console.error('Error streaming photo:', err);
    res.status(500).json({ message: 'Could not retrieve image' });
  }
});

/**
 * GET all reports
 */
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    console.error('Error in GET /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET one report by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const rpt = await Report.findById(req.params.id);
    if (!rpt) return res.status(404).json({ message: 'Not found' });
    res.json(rpt);
  } catch (err) {
    console.error('Error in GET /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update status
 */
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Finished'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const rpt = await Report.findById(req.params.id);
    if (!rpt) return res.status(404).json({ message: 'Not found' });
    rpt.status = status;
    rpt.updatedAt = Date.now();
    await rpt.save();
    res.json({ message: 'Status updated', report: rpt });
  } catch (err) {
    console.error('Error in PUT /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Delete
 */
router.delete('/:id', async (req, res) => {
  try {
    const rpt = await Report.findByIdAndDelete(req.params.id);
    if (!rpt) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error in DELETE /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
