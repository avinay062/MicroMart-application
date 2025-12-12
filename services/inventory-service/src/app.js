const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./utils/db');
const { setInventoryRoutes } = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Set up routes
setInventoryRoutes(app);

app.listen(PORT, () => {
    console.log(`Inventory Service is running on port ${PORT}`);
});