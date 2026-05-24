// lib/dbClient.js — MongoClient connection (used by Auth.js / MongoDBAdapter)
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const mongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5_000,
};

// globalThis guard applies in both dev and production.
// Without it, every cold-start on Vercel creates a new TLS connection.
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, mongoClientOptions);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export default clientPromise;
