#!/usr/bin/env tsx

import path from "path";
import dotenv from "dotenv";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { authService } from "./auth";

async function setupAdmin() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: npm run setup-admin <username> <password>");
    process.exit(1);
  }

  try {
    const admin = await authService.createAdmin(username, password);
    console.log("Admin user created successfully:");
    console.log(`Username: ${admin.username}`);
    console.log(`ID: ${admin.id}`);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

setupAdmin();
