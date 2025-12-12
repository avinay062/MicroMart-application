const jwt = require('jsonwebtoken');
const SECTRET_KEY = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    console.log('Authenticating user with token from cookies:', req.cookies?.token);
    console.log('Environment JWT_SECRET:', SECTRET_KEY);
    try {
        console.log("inside try>>>>>>>>>>>>>>>>>>>>>>>");
        const token = req.cookies?.token;
        console.log('Extracted token:',req, token);
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }
        const decoded = jwt.verify(token, SECTRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
};

module.exports = {
    authenticateUser
};