import express from 'express';
import { connectDB } from './utils/db.js';
import { setProductRoutes } from './routes/productRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

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

// Configure upload directory using environment variable or default to 'uploads' in the current working directory
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

// Ensure the 'uploads' directory exists
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (error) {
    console.error('Error creating uploads directory:', error);
    process.exit(1); // Exit the application if the directory cannot be created
}

// Serve static files from the upload directory
app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});

export default app;
