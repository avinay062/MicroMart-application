const express = require('express');
const { connectDB } = require('./utils/db');
const {setProductRoutes} = require('./routes/productRoutes');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(express.json()); 
app.use(cookieParser()); 

setProductRoutes(app);

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});