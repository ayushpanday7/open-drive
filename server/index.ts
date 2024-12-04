/**
 * @fileoverview Main server entry point for Open Drive application
 * @requires express
 * @requires https
 * @requires os
 * @requires react-server-dom-webpack/server
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Express application instance */
const app = express();

/** Express router for API routes */
export const apiRouter = express.Router();

// middleweare handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

const sslOptions = {
  key: fs.readFileSync("./certificate/private.key"),
  cert: fs.readFileSync("./certificate/certificate.crt"),
};

const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

/**
 * Vite server instance
 * @type {ViteDevServer | undefined}
 */
let viteApp: ViteDevServer | undefined;

// Initialize Vite server
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
      app.use(viteApp.middlewares);
      console.log("Vite middleware initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Vite server:", error);
    process.exit(1);
  }
};

// Initialize Vite
await initVite();

app.get("*", async (req, res) => {
  try {
    const url = req.originalUrl;
    const { render } = await import("./frontend/server/entry-server.js");
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
 * Get the machine's IP address
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

/**
 * HTTPS server configuration
 * Using SSL certificates for secure connections
 */
const server = https.createServer(sslOptions, app);

/**
 * Start the server
 * Listens on all network interfaces (0.0.0.0) on port 3001
 * @listens {number} 3001 - The port number
 */
server.listen(3001, "0.0.0.0", () => {
  console.log(`Server started on https://${ip}:3001`);
});
