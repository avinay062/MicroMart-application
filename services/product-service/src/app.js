import express from 'express';
import { randomUUID } from 'crypto';
import { connectDB } from './utils/db.js';
import { setProductRoutes } from './routes/productRoutes.js';
import { setCartRoutes } from './routes/cartRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import { notFoundErrorHandler, globalErrorHandler } from 'shared-utils';

const app = express();
const PORT = process.env.PORT || 30011;

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(attachRequestContext);

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    })
);

app.get('/', (req, res) => {
    req.session.isAuthenticated = true;
    console.log('Session:', req.session);
    res.send('Welcome to the Product Service!');
});




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

app.use(notFoundErrorHandler);
app.use(globalErrorHandler());

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});

export default app;
