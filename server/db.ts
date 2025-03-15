import * as dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load environment variables from .env file
dotenv.config();

// Get database URL from environment variable or set a default
const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Create postgres client
const client = postgres(databaseUrl);

// Create drizzle database instance
export const db = drizzle(client);
