const mongoose = require('mongoose');
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const Report = require('../models/Report');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// mailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
    },
});

// GET /api/admin/reports
router.get(
    '/reports',
    authMiddleware,
    isAdmin,
    async (req, res) => {
        try {
            const reports = await Report.find().lean();
            const populated = await Promise.all(
                reports.map(async rpt => {
                    // default
                    let creator = { name: 'anonymous', email: '' };
                    // only lookup if valid ObjectId
                    if (rpt.createdBy && mongoose.Types.ObjectId.isValid(rpt.createdBy)) {
                        const u = await User.findById(rpt.createdBy).select('name email');
                        if (u) creator = { name: u.name, email: u.email };
                    }
                    return { ...rpt, createdBy: creator };
                })
            );
            res.json(populated);
        } catch (err) {
            console.error('Admin GET reports error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// PUT /api/admin/reports/:id/status
router.put(
    '/reports/:id/status',
    authMiddleware,
    isAdmin,
    async (req, res) => {
        try {
            const { status } = req.body;
            const valid = ['Pending', 'In Progress', 'Finished'];
            if (!valid.includes(status))
                return res.status(400).json({ message: 'Invalid status' });

            const rpt = await Report.findById(req.params.id);
            if (!rpt) return res.status(404).json({ message: 'Not found' });

            rpt.status = status;
            await rpt.save();

            // email creator
            if (rpt.createdBy && mongoose.Types.ObjectId.isValid(rpt.createdBy)) {
                const u = await User.findById(rpt.createdBy);
                if (u?.email) {
                    transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: u.email,
                        subject: `🔄 Your report is now "${status}"`,
                        html: `
              <p>Hi ${u.name},</p>
              <p>Your report "<strong>${rpt.title}</strong>" is now <strong>${status}</strong>.</p>
            `
                    }).catch(console.error);
                }
            }

            res.json({ message: 'Status updated', report: rpt });
        } catch (err) {
            console.error('Admin PUT status error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// DELETE /api/admin/reports/:id
router.delete(
    '/reports/:id',
    authMiddleware,
    isAdmin,
    async (req, res) => {
        try {
            const rpt = await Report.findById(req.params.id);
            if (!rpt) return res.status(404).json({ message: 'Not found' });

            await rpt.deleteOne();

            // email creator
            if (rpt.createdBy && mongoose.Types.ObjectId.isValid(rpt.createdBy)) {
                const u = await User.findById(rpt.createdBy);
                if (u?.email) {
                    transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: u.email,
                        subject: '❌ Your report was deleted',
                        html: `
              <p>Hi ${u.name},</p>
              <p>Your report "<strong>${rpt.title}</strong>" was deleted by an admin.</p>
            `
                    }).catch(console.error);
                }
            }

            res.json({ message: 'Deleted' });
        } catch (err) {
            console.error('Admin DELETE error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
