import path from "path";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

console.log(process.env.DATABASE_URL ? "Database URL loaded" : "Database URL missing");
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
