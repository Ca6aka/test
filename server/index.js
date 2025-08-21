import express from "express";
import session from "express-session";
import os from "os";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { storageAdapter as storage } from "./storage-adapter.js";
import { DatabaseBackup } from "../database/backup.js";

const app = express();
app.set('trust proxy', true); // Enable IP tracking for registration limits
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with fallback to memory store
app.use(session({
  secret: process.env.SESSION_SECRET || 'serversim-secret-key-v2',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Extend session on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for better UX
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

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
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Middleware to update user activity on all API calls (excluding automatic updates)
app.use('/api', async (req, res, next) => {
  if (req.session.userId && !req.path.includes('/auth/logout') && !req.path.includes('/api/stats/') && !req.path.includes('/api/rankings')) {
    try {
      await storage.updateUserActivity(req.session.userId);
      // Check expired mutes periodically
      await storage.checkExpiredMutes();
    } catch (error) {
      // Ignore errors to not interrupt the request
    }
  }
  next();
});

// Background income updater - runs every minute
setInterval(async () => {
  try {
    await storage.updateAllActiveUsersIncome();
  } catch (error) {
    log(`Income update error: ${error.message}`);
  }
}, 60000); // Every 60 seconds

// Initialize storage and backup system
async function initializeServer() {
  log('🔄 Initializing storage system...');
  await storage.initialize();
  
  // Setup scheduled backups in production
  if (process.env.NODE_ENV === 'production') {
    log('⏰ Setting up scheduled backups...');
    DatabaseBackup.setupScheduledBackups();
  }
  
  log('✅ Server initialization complete');
}

(async () => {
  // Initialize storage before starting server
  await initializeServer();
  
  const server = await registerRoutes(app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    const interfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    // Find local IP address
    Object.keys(interfaces).forEach(interfaceName => {
      const nets = interfaces[interfaceName];
      nets.forEach(net => {
        if (net.family === 'IPv4' && !net.internal) {
          localIP = net.address;
        }
      });
    });
    
    log(`Server started successfully!`);
    log(`Storage type: ${storage.getStorageType()}`);
    log(`Local access: http://localhost:${port}`);
    log(`Network access: http://${localIP}:${port}`);
    log(`External access: Configure your router/firewall to forward port ${port}`);
  });

  // Graceful shutdown handling for PM2
  process.on('SIGINT', () => {
    log('🔄 Received SIGINT, shutting down gracefully...');
    server.close(() => {
      log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    log('🔄 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
      log('✅ Server closed');
      process.exit(0);
    });
  });
})();
