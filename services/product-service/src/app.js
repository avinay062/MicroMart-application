import express from 'express';
import { connectDB } from './utils/db.js';
import { setProductRoutes } from './routes/productRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 30011;

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