import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Parse the connection string to get credentials
const dbUrl = new URL(process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres");

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1), // Remove leading slash
    port: Number(dbUrl.port) || 5432,
    ssl: false,
  }
});
