const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Set up Multer for file uploads (use memory storage instead of disk storage)
const storage = multer.memoryStorage();  // Store files in memory as buffers
const upload = multer({ storage });

// POST route for report submission
router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    console.log("Request Body: ", req.body);  // Log incoming data
    console.log("Uploaded Files: ", req.files);  // Log uploaded files

    const { title, description, category, location, department, anonymous, emergency } = req.body;

    // Parse location from stringified JSON to an object (lat and lon)
    let parsedLocation = null;
    if (location) {
      parsedLocation = JSON.parse(location);  // Parse location if stringified
    }

    // Validate required fields
    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get uploaded photos (if any)
    const photos = req.files ? req.files.map((file) => file.path) : [];  // Handle photos if any

    // Create new report object
    const newReport = new Report({
      title,
      description,
      category,
      location: parsedLocation,  // location can be null if not provided
      department,
      photos,  // If no photos, this will be an empty array
      anonymous: anonymous || false,
      emergency: emergency || false,
      createdBy: 'anonymous',  // Default to 'anonymous' if no user authentication is available
    });

    await newReport.save();
    res.status(201).json({ message: 'Report created successfully', report: newReport });
  } catch (err) {
    console.error('Error in POST /reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;



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
