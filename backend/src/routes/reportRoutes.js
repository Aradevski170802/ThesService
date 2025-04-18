const router    = require('express').Router();
const multer    = require('multer');
const mongoose  = require('mongoose');
const Report    = require('../models/Report');

// 1) Use Multer memory storage to buffer uploads
const storage = multer.memoryStorage();
const upload  = multer({ storage });
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

/**
 * POST /api/reports
 * - upload up to 5 photos into GridFS
 * - store the resulting file IDs in Report.photos
 */
router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    const { title, description, category, location, anonymous, emergency } = req.body;
    // parse the JSON‐stringified coords
    const loc = JSON.parse(location);
    if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
      return res.status(400).json({ message: 'Invalid location format' });
    }

    // 1) reverse‐geocode to get a human address
    const geoRes = await geocoder.reverse({ lat: loc.lat, lon: loc.lng });
    const humanAddress = geoRes[0]?.formattedAddress || geoRes[0]?.displayName || '';

    // 2) upload photos into GridFS (your existing code)
    const bucket   = req.app.locals.gfsBucket;
    const photoIds = [];
    for (const file of req.files) {
      const stream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype
      });
      stream.end(file.buffer);
      await new Promise((r, e) => {
        stream.on('finish', r);
        stream.on('error',  e);
      });
      photoIds.push(stream.id);
    }

    // 3) save the report, including `address`
    const report = new Report({
      title,
      description,
      category,
      location: { lat: loc.lat, lon: loc.lng },
      address: humanAddress,          // ← store it here
      anonymous: anonymous === 'true',
      emergency: emergency === 'true',
      photos:    photoIds,
      createdBy: 'anonymous'
    });

    await report.save();
    res.status(201).json({ message: 'Report created', report });
  } catch (err) {
    console.error('Error in POST /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/reports/photo/:id
 * Stream back an image from GridFS by its file ObjectID
 */
router.get('/photo/:id', (req, res) => {
  try {
    const bucket = req.app.locals.gfsBucket;
    const _id    = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on('error', () => res.sendStatus(404));
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error streaming photo:', err);
    res.status(500).json({ message: 'Could not retrieve image' });
  }
});

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    console.error('Error in GET /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET one report by ID
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

// Update status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending','In Progress','Resolved'].includes(status)) {
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

// Delete
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
