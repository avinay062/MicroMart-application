const express = require('express');
const { randomUUID } = require('crypto');
const { connectDB } = require('./utils/db');
const { setUserRoutes } = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {
  AppError,
  catchAsync,
  notFoundErrorHandler,
  globalErrorHandler
} = require('shared-utils');

const app = express();
const PORT = process.env.PORT || 3004;

connectDB();

const attachRequestContext = (req, res, next) => {
  const headerId = req.headers['x-correlation-id'];
  const traceId = headerId || randomUUID();
  req.traceId = traceId;
  res.setHeader('x-correlation-id', traceId);
  next();
};

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(attachRequestContext);

const simulateProviderCall = async () => {
  const error = new Error('Gateway timeout');
  error.code = 'UPSTREAM_TIMEOUT';
  throw error;
};

app.get('/test/operational', catchAsync(async (req, res, next) => {
  return next(AppError.notFound('User not found', { userId: 'demo-user' }));
}));

app.get('/test/programming', (req, res) => {
  throw new Error('Programming error simulated');
});

app.get('/test/external', catchAsync(async (req, res, next) => {
  try {
    await simulateProviderCall();
    res.json({ status: 'ok' });
  } catch (err) {
    return next(new AppError({
      message: 'Payment provider unavailable',
      statusCode: 502,
      code: 'ERR_PROVIDER_UNAVAILABLE',
      details: { providerMessage: err.message },
      isOperational: false
    }));
  }
}));

setUserRoutes(app);

app.use(notFoundErrorHandler);
app.use(globalErrorHandler());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
