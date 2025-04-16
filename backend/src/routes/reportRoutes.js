// backend/src/routes/reportRoutes.js
const router = require('express').Router();
// const authMiddleware = require('../middleware/authMiddleware');  // Import auth middleware
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    console.log("Request Body: ", req.body);
    console.log("Uploaded Files: ", req.files);

    const { title, description, category, location, anonymous, emergency } = req.body;

    // Validate required fields (removed department)
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse the location (expecting a JSON string)
    const locationObj = JSON.parse(location);
    // Check that both lat and lng are available
    if (!locationObj.lat || !locationObj.lng) {
      return res.status(400).json({ message: 'Invalid location data' });
    }

    const photos = req.files ? req.files.map(file => file.path) : [];

    // Set createdBy to 'anonymous'
    const createdBy = 'anonymous';

    // Create the new report
    const newReport = new Report({
      title,
      description,
      category,
      location: { lat: locationObj.lat, lon: locationObj.lng },
      anonymous: anonymous === 'true',
      emergency: emergency === 'true',
      photos,
      createdBy,
    });

    await newReport.save();
    res.status(201).json({ message: 'Report created successfully', report: newReport });
  } catch (err) {
    console.error('Error in POST /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});






// GET /api/reports - Fetch all reports
router.get('/', async (req, res) => {
  try {
    const { status, department, emergency } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (department) filters.department = department;
    if (emergency) filters.emergency = emergency === 'true';  // Convert string to boolean

    const reports = await Report.find(filters);
    res.json(reports);
  } catch (err) {
    console.error('Error in GET /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reports/:id - Fetch a single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error('Error in GET /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/reports/:id - Update the status of a report
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    report.updatedAt = Date.now();
    await report.save();

    res.json({ message: 'Report status updated', report });
  } catch (err) {
    console.error('Error in PUT /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reports/:id - Delete a report by ID
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /reports/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - location
 *         - description
 *         - department
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the report
 *         location:
 *           type: string
 *           description: Location of the issue
 *         description:
 *           type: string
 *           description: Description of the problem
 *         department:
 *           type: string
 *           description: Department handling the issue
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: Photos related to the report
 *         anonymous:
 *           type: boolean
 *           description: Flag to determine if the report is anonymous
 *         emergency:
 *           type: boolean
 *           description: Flag to determine if the report is an emergency
 *         status:
 *           type: string
 *           enum:
 *             - Pending
 *             - In Progress
 *             - Resolved
 *           description: The current status of the report
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the report was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the report was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Infrastructure report creation, status updates, and management
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new infrastructure report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'  # Reference the schema here
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get a single report by ID
 *     tags: [Reports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the report to retrieve
 *     responses:
 *       200:
 *         description: The report details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'  # Reference the schema here
 *       404:
 *         description: Report not found
 */

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update the status of a report
 *     tags: [Reports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the report to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Resolved]
 *     responses:
 *       200:
 *         description: Report status updated
 *       400:
 *         description: Invalid status or missing fields
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the report to delete
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */


module.exports = router;
