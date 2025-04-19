const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer'); // For sending verification emails

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
};

// POST /register - Register a new user
router.post('/register', async (req, res) => {
    console.log("Received Registration Data:", req.body); // Log the request body
    try {
        const { name, surname, email, password, confirmPassword, phone, country } = req.body;

        // Basic validations
        if (!name || !surname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check for existing user with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Password confirmation check
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash the password (bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name,
            surname,
            email,
            password: hashedPassword,
            phone,
            country,
            isVerified: false, // Email not verified yet
        });
        await newUser.save();

        // Generate a verification code (6-digit number)
        const verificationCode = generateVerificationCode();

        // Save the verification code to the user document
        newUser.verificationCode = verificationCode;
        await newUser.save();

        // Send verification email with the code
        sendVerificationEmail(newUser.email, verificationCode);

        res.status(201).json({
            message: 'User registered successfully. Please check your email for verification.',
            user: {
                _id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error('Error in POST /register:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Function to send verification email
const sendVerificationEmail = (email, verificationCode) => {
    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationCode}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Please verify your email address',
        html: `<p>Please use the following code to verify your email address:</p><p><strong>${verificationCode}</strong></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err); // Log the error details
            return;
        } else {
            console.log('Verification email sent: ' + info.response); // Log the successful email sending info
        }
    });
};

// GET /verify/:code - Verify user email with the code
router.get('/verify/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const user = await User.findOne({ verificationCode: code });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.isVerified = true;  // Set user as verified
        user.verificationCode = null; // Clear the verification code
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error in GET /verify/:code:', err);
        res.status(400).json({ message: 'Invalid or expired code' });
    }
});

// POST /login - User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Respond with user details + token
        res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error('Error in POST /login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /change-password - Change user's password
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get the user from the JWT token
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare current password with the stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password and update the user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error in POST /change-password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/// POST /change-email - Change the user's email address
router.post('/change-email', async (req, res) => {
    try {
        const { newEmail } = req.body;

        // Ensure the user is authenticated
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'No token provided, access denied.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the new email is already in use
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Generate a new verification code for the new email
        const verificationCode = generateVerificationCode();

        // Update the user's email and save the verification code
        user.email = newEmail;
        user.verificationCode = verificationCode;
        await user.save();

        // Send verification email with the new code
        sendVerificationEmail(newEmail, verificationCode);

        res.status(200).json({ message: 'Email address changed. Please verify your new email.' });
    } catch (err) {
        console.error('Error in POST /change-email:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// GET /verify-new-email/:code - Verify the new email address with the code
router.get('/verify-new-email/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const user = await User.findOne({ verificationCode: code });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.isVerified = true;  // Set user as verified
        user.verificationCode = null; // Clear the verification code
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error in GET /verify-new-email/:code:', err);
        res.status(400).json({ message: 'Invalid or expired code' });
    }
});

module.exports = router;
