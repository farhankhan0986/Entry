// lib/db.js
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Shared connection options — Atlas-safe, Vercel-safe
const mongooseOptions = {
  maxPoolSize: 10,            // Max open sockets per serverless worker
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  retryWrites: true,
  w: "majority",
};

const mongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5_000,
};

// --- Pattern A: Mongoose (For your Blog models) ---
// globalThis cache survives hot-reloads in dev and keeps the connection alive
// across invocations in the same Vercel worker process in production.
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, mongooseOptions)
      .then((m) => m)
      .catch((err) => {
        // Reset so the next call can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Pattern B: MongoClient (For Auth.js / MongoDBAdapter) ---
// IMPORTANT: The globalThis guard must apply in BOTH dev and production.
// Without it in production every cold-start creates a new TLS connection.
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, mongoClientOptions);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export default clientPromise; // This is what Auth.js needs