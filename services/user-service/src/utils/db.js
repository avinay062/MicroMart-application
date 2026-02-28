const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Prefer environment/.env and environment/.env.local (if you use that folder)
dotenv.config({ path: path.join(__dirname, '../../environment/.env') });
dotenv.config({ path: path.join(__dirname, '../../environment/.env.local'), override: true });
// Also support service-root .env/.env.local (common on Windows)
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local'), override: true });
// Fallback to process.cwd() .env if present
dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI || typeof process.env.MONGODB_URI !== 'string') {
            throw new Error('MONGODB_URI environment variable is not defined or is not a valid string.');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB };
