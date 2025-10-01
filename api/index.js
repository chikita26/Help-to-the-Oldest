import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import express from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Vercel uses HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Register API routes
await registerRoutes(app);

// Serve static files from dist/public
const distPath = path.resolve(__dirname, "..", "dist", "public");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Fallback to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  console.warn(`Static files directory not found: ${distPath}`);
}

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Export for Vercel serverless
export default app;
