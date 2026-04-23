// lib/db.js
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

// --- Pattern A: Mongoose (For your Blog models) ---
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Pattern B: MongoClient (For Auth.js / MongoDBAdapter) ---
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; // This is what Auth.js needs