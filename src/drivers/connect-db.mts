import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!DB_NAME) {
    throw new Error("DB_NAME is not defined in environment variables");
}

mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected to database: ${DB_NAME}`);
    console.log(`Connection state: ${mongoose.connection.readyState}`);
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

try {
    await mongoose.connect(MONGODB_URI, {
        dbName: DB_NAME,
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000, // 5 segundos timeout
        connectTimeoutMS: 10000, // 10 segundos timeout
        maxPoolSize: 10 // Mantener hasta 10 conexiones
    });
    console.log(`Database connection initiated to: ${DB_NAME}`);
} catch (error: any) {
    console.log("Database connection error:", error.message);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

export default mongoose;

