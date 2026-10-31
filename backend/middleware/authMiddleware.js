const jwt = require('jsonwebtoken');
require('dotenv').config();

// Token Verification Middleware
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'roxiler_jwt_secret_key_default';
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Decoded payload (id, role)
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
    return next();
};

// Role-based Access Control Middleware
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};
