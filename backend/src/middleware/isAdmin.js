// backend/middleware/isAdmin.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        // Verify and decode JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check for admin role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only.' });
        }
        // Attach user info (including role) to request
        req.user = decoded;
        next();
    } catch (err) {
        console.error('isAdmin middleware error:', err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
