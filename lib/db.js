// lib/db.js — Mongoose connection (used by all server actions & API routes)
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  retryWrites: true,
  w: "majority",
};

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
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;