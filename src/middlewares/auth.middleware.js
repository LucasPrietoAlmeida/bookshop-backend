const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided in Authorization header' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Authorization header format must be: Bearer <token>' });
        }

        const token = parts[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('JWT verification error:', err.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found for provided token' });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error('Auth middleware unexpected error:', err);
        res.status(500).json({ message: 'Server error in auth middleware' });
    }
};

module.exports = authMiddleware;
