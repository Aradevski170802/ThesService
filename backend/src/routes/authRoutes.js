// backend/routes/authRoutes.js
require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// single‐admin override (trim & lowercase)
const adminEmail = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.trim().toLowerCase()
    : '';
console.log('→ ADMIN_EMAIL from .env:', JSON.stringify(adminEmail));


// mailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
    },
});
const generateVerificationCode = () =>
    Math.floor(100000 + Math.random() * 900000);
const sendVerificationEmail = (email, code) => {
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `<p>Your code: <strong>${code}</strong></p>`
    }, (err, info) => {
        if (err) console.error('Mail error:', err);
        else console.log('Verification email sent:', info.response);
    });
};

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { name, surname, email, password, confirmPassword, phone, country } = req.body;
        if (!name || !surname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords mismatch' });
        }
        if (await User.findOne({ email: email.toLowerCase() })) {
            return res.status(400).json({ message: 'Email in use' });
        }

        // Determine role & verification status
        const isAdminUser = email.toLowerCase() === adminEmail;
        const role = isAdminUser ? 'admin' : 'user';
        const isVerified = isAdminUser;  // skip verify for admin

        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            surname,
            email: email.toLowerCase(),
            password: hash,
            phone,
            country,
            role,
            isVerified,
            verificationCode: null  // will set below if needed
        });

        if (!isAdminUser) {
            // only generate code & email if not admin
            const code = generateVerificationCode();
            newUser.verificationCode = code;
            await newUser.save();
            sendVerificationEmail(newUser.email, code);
        }

        res.status(201).json({
            message: isAdminUser
                ? 'Admin account created.'
                : 'Registered. Please check your email for verification.',
            user: {
                _id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
                role     // include role here so front‑end knows about it immediately
            }
        });
    } catch (err) {
        console.error('Error in POST /register:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /verify/:code
router.get('/verify/:code', async (req, res) => {
    try {
        const user = await User.findOne({ verificationCode: req.params.code });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();
        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error in GET /verify/:code:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Ensure role is passed through
        const isAdminUser = user.email.toLowerCase() === adminEmail;
        const role = isAdminUser ? 'admin' : user.role;

        const token = jwt.sign(
            { userId: user._id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role
            },
            token
        });
    } catch (err) {
        console.error('Error in POST /login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /change-password
router.post('/change-password', async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(' ')[1];
        if (!auth) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Wrong current password' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error in POST /change-password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /change-email
router.post('/change-email', async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(' ')[1];
        if (!auth) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const { newEmail } = req.body;
        if (await User.findOne({ email: newEmail.toLowerCase() })) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const code = generateVerificationCode();
        user.email = newEmail.toLowerCase();
        user.isVerified = false;
        user.verificationCode = code;
        await user.save();
        sendVerificationEmail(user.email, code);

        res.json({ message: 'Email changed. Please verify your new email.' });
    } catch (err) {
        console.error('Error in POST /change-email:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /verify-new-email/:code
router.get('/verify-new-email/:code', async (req, res) => {
    try {
        const user = await User.findOne({ verificationCode: req.params.code });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();
        res.json({ message: 'New email verified successfully' });
    } catch (err) {
        console.error('Error in GET /verify-new-email/:code:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
