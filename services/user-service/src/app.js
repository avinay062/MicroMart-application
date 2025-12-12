const express = require('express');
const {connectDB} = require('./utils/db');
const { setUserRoutes } = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3004;

connectDB();

app.use(cors({
    origin: true, // This accepts all origins but maintains the security checks
    credentials: true
}));
app.use(express.json()); 
app.use(cookieParser()); 

setUserRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
