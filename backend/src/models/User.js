const mongoose = require('mongoose'); // <-- Ensure mongoose is imported

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    country: {
        type: String
    },
    // Optional: add 'role' if you'd like to differentiate 'user', 'department', 'admin', etc.
    role: {
        type: String,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
