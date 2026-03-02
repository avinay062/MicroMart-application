const express = require('express');
const { randomUUID } = require('crypto');
const { connectDB } = require('./utils/db');
const { setOrderRoutes } = require('./routes/orderRoutes');
const { notFoundErrorHandler, globalErrorHandler } = require('shared-utils');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
const attachRequestContext = (req, res, next) => {
    const headerId = req.headers['x-correlation-id'];
    const traceId = headerId || randomUUID();
    req.traceId = traceId;
    res.setHeader('x-correlation-id', traceId);
    next();
};

app.use(express.json());
app.use(attachRequestContext);

// Set up routes
setOrderRoutes(app);

app.use(notFoundErrorHandler);
app.use(globalErrorHandler());

app.listen(PORT, () => {
    console.log(`Order Service is running on port ${PORT}`);
});

module.exports = app;