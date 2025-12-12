const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./utils/db');
const { setOrderRoutes } = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Set up routes
setOrderRoutes(app);

app.listen(PORT, () => {
    console.log(`Order Service is running on port ${PORT}`);
});