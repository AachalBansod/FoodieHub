import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectMongo() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set, skipping DB connection');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'foodiehub',
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    // Do not crash the server; just continue without DB if needed
  }
}

export default mongoose;
