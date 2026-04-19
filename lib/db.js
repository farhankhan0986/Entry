import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({quiet: true});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI");
}

let cached = global.mongoose || { conn: null, promise: null };

global.mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  console.log("Connected to MongoDB");

  return cached.conn;
}
