/**
 * @fileoverview Main server entry point for Open Drive application.
 * This file sets up an HTTPS server with Express and Vite integration for server-side rendering.
 *
 * @module server/index
 * @requires express - Express web framework
 * @requires https - HTTPS server functionality
 * @requires os - Operating system utilities
 * @requires fs - File system operations
 * @requires url - URL handling utilities
 * @requires path - Path manipulation utilities
 * @requires vite - Vite development server
 * @requires react-server-dom-webpack/server - React Server Components support
 */

import express from "express";
import https from "https";
import os from "os";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createServer } from "vite";
import type { ViteDevServer } from "vite";
import { Transform } from "node:stream";
import cookieParser from "cookie-parser";
import { Database } from "@database";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { apiRouter } from "./routes";
import "./contollers";

export let isFirstUser = false;

/**
 * Express application instance
 * @type {Express}
 */
const app = express();

/**
 * Express router for API routes
 * @type {express.Router}
 */

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create and configure API router

// Debug middleware for API routes
apiRouter.use((req, res, next) => {
  console.log(apiRouter.stack.map((layer) => layer.route?.path));
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes before any other middleware
app.use("/api", apiRouter);

/**
 * SSL configuration options for HTTPS server
 * @type {Object}
 * @property {Buffer} key - Private key for SSL
 * @property {Buffer} cert - SSL certificate
 */
const sslOptions = {
  key: fs.readFileSync("./certificate/private.key"),
  cert: fs.readFileSync("./certificate/certificate.crt"),
};

/**
 * Base URL path for the application
 * @type {string}
 */
const base = process.env.BASE || "/";

/**
 * Timeout delay for aborting server-side rendering (in milliseconds)
 * @type {number}
 */
const ABORT_DELAY = 10000;

/**
 * Vite server instance for development
 * @type {ViteDevServer | undefined}
 */
let viteApp: ViteDevServer | undefined;

/**
 * Initializes the Vite development server
 * @async
 * @function initVite
 * @returns {Promise<void>}
 * @throws {Error} If Vite server initialization fails
 */
const initVite = async () => {
  try {
    viteApp = await createServer({
      server: {
        middlewareMode: true,
        hmr: true,
      },
      appType: "custom",
      base,
      root: resolve(__dirname, "../server/frontend/client"),
    });

    if (viteApp) {
      // Only apply Vite middleware for non-API routes
      app.use((req, res, next) => {
        if (!req.path.startsWith("/api")) {
          viteApp?.middlewares(req, res, next);
        } else {
          next();
        }
      });
      console.log("Vite middleware initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Vite server:", error);
    process.exit(1);
  }
};

// Initialize Vite
await initVite();

/**
 * Universal route handler for all non-API requests
 * Implements server-side rendering with React Server Components
 *
 * @async
 * @function
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @returns {Promise<void>}
 */
app.get("*", async (req, res, next) => {
  // Skip this handler for API routes
  if (req.path.startsWith("/api")) {
    return next();
  }

  try {
    const url = req.originalUrl;
    const { render } = await import("./frontend/server/entry-server");
    let didError = false;

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },

      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });
        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });
        const [htmlStart, htmlEnd] = [
          `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>My App</title> </head> <body> <div id="root">`,
          `</div> </body> </html>`,
        ];
        res.write(htmlStart);
        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });
        pipe(transformStream);
      },

      onError(error: any) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    console.log("this is error while rendering", e);
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
});

/**
 * HTTPS server instance
 * @type {https.Server}
 */
const server = https.createServer(sslOptions, app);

/**
 * Retrieves the machine's network IP address
 * @function
 * @returns {string} The first non-internal IPv4 address or 'localhost' if none found
 */
const networkInterfaces = os.networkInterfaces();
const ip =
  Object.values(networkInterfaces)
    .flat()
    .find(
      (interfaceInfo) =>
        !interfaceInfo?.internal && interfaceInfo?.family === "IPv4"
    )?.address || "localhost";

Database.connect().then(async () => {
  const userDocumentCount = await Database.GET_MODEL("users").countDocuments();

  if (userDocumentCount === 0) {
    isFirstUser = true;
  }

  /**
   * Starts the HTTPS server
   * @listens {number} 3001 - The port number
   * @event listening - Emitted when the server starts listening
   */
  server.listen(3001, "0.0.0.0", () => {
    console.log(`Server started on https://${ip}:3001`);
  });
});
