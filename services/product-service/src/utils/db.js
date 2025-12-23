import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

export { connectDB };