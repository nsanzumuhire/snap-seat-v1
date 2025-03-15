import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        if (Array.isArray(capturedJsonResponse)) {
          logLine += ` :: ${capturedJsonResponse.length} items`;
          if (capturedJsonResponse.length > 0) {
            logLine += ` (first id: ${capturedJsonResponse[0].id})`;
          }
        } else {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 100)}`;
          if (JSON.stringify(capturedJsonResponse).length > 100) {
            logLine += "...";
          }
        }
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      log(`Error: ${message}`);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use fixed port 5000 only, exit if not available
    const PORT = 5000;

    server.listen(PORT, '0.0.0.0', () => {
      log(`Server running at http://localhost:${PORT}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${PORT} is already in use. Exiting...`);
        process.exit(1);
      } else {
        log(`Failed to start server: ${err.message}`);
      }
    });
  } catch (error) {
    log(`Error during server startup: ${error}`);
    process.exit(1);
  }
})();
