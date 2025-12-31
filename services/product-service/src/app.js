import express from 'express';
import { connectDB } from './utils/db.js';
import { setProductRoutes } from './routes/productRoutes.js';
import { setCartRoutes } from './routes/cartRoutes.js';
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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

setProductRoutes(app);
setCartRoutes(app);


// const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

// // Ensure the 'uploads' directory exists
// try {
//     if (!fs.existsSync(uploadsDir)) {
//         fs.mkdirSync(uploadsDir, { recursive: true });
//     }
// } catch (error) {
//     console.error('Error creating uploads directory:', error);
//     process.exit(1); 
// }

// // Serve static files from the upload directory
// app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});

export default app;
