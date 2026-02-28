const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const env = require('./config/env');
const { requireAuth } = require('./middleware/auth');

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth at gateway (public allowlist handled inside middleware)
app.use(requireAuth);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    gateway: 'api-gateway',
    services: env.services,
  });
});

// Proxy helpers
const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  xfwd: true,
  // Keep original path; we mount the proxy at the same base path.
  // Add user headers for downstream services if needed later.
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.user?.id) proxyReq.setHeader('x-user-id', String(req.user.id));
      if (req.user?.email) proxyReq.setHeader('x-user-email', String(req.user.email));
    },
  },
});

// Route mapping (same paths as upstream services)
app.use('/api/users', createProxyMiddleware(proxyOptions(env.services.user)));
app.use('/api/products', createProxyMiddleware(proxyOptions(env.services.product)));
app.use('/api/cart', createProxyMiddleware(proxyOptions(env.services.product)));
app.use('/orders', createProxyMiddleware(proxyOptions(env.services.order)));
app.use('/inventory', createProxyMiddleware(proxyOptions(env.services.inventory)));

const port = env.port;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway listening on port ${port}`);
});

module.exports = app;

