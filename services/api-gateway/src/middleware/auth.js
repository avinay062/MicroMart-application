const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Public routes that don't require auth at the gateway.
 * We allow unauthenticated signup/signin so users can obtain a token cookie.
 */
const publicRoutes = [
  { method: 'POST', path: '/api/users/signup' },
  { method: 'POST', path: '/api/users/signin' },
];

function isPublicRoute(req) {
  const method = (req.method || '').toUpperCase();
  const path = req.path || '';
  return publicRoutes.some((r) => r.method === method && r.path === path);
}

/**
 * Gateway-level auth:
 * - reads JWT from cookie `token`
 * - verifies using JWT_SECRET
 * - attaches decoded payload on req.user
 */
function requireAuth(req, res, next) {
  if (isPublicRoute(req)) return next();

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }
  if (!env.jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET not configured in gateway' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
}

module.exports = { requireAuth, isPublicRoute };

