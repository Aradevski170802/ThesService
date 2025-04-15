// backend/src/routes/authRoutes.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields or email already exists
 *       500:
 *         description: Server error
 */

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { name, surname, email, password, phone, country } = req.body;

        // 1) Basic validations
        if (!name || !surname || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // 2) Check for existing user with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // 3) Hash the password (bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4) Create and save the new user
        const newUser = new User({
            name,
            surname,
            email,
            password: hashedPassword,
            phone,
            country,
        });
        await newUser.save();

        // 5) Optionally, generate a token so user is immediately logged in
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }  // token valid for 1 day
        );

        // Return the newly created user (omitting password) and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email
            },
            token
        });
    } catch (err) {
        console.error('Error in POST /register:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        // 2) Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3) Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4) Create a JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5) Respond with user details + token
        res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Error in POST /login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
