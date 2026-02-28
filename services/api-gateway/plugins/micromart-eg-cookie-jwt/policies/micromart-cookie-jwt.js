'use strict';

const cookie = require('cookie');

module.exports = {
  name: 'micromart-cookie-jwt',
  schema: {
    $id: 'http://express-gateway.io/schemas/policies/micromart-cookie-jwt.json',
    type: 'object',
    properties: {
      cookieName: { type: 'string', default: 'token' }
    }
  },
  policy: (actionParams) => {
    const cookieName = actionParams?.cookieName || 'token';
    return (req, res, next) => {
      // If Authorization already present, don't override
      if (req.headers && req.headers.authorization) return next();

      const headerCookie = req.headers?.cookie || '';
      if (!headerCookie) return next();

      const parsed = cookie.parse(headerCookie);
      const token = parsed?.[cookieName];
      if (!token) return next();

      req.headers.authorization = `Bearer ${token}`;
      return next();
    };
  }
};

