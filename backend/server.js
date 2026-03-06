const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Basic runtime guard for required secrets
if (!process.env.API_KEY) {
  console.warn("[startup] API_KEY is missing; API requests will fail");
}

// Trust proxy for accurate IPs behind reverse proxies (nginx/traefik)
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

// CORS — lock to configured origins; allow localhost in non-production
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Allow typical private-network origins during local dev (helps when testing from LAN IP)
const lanOriginRegex =
  /^http:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d+)?$/;

// Allow nip.io style hostnames that resolve to private IPs (e.g., 192-168-0-127.nip.io)
const nipOriginRegex = /^https?:\/\/(\d{1,3}-){3}\d{1,3}\.nip\.io(?::\d+)?$/;

// Allow Cloudflare quick tunnels (*.trycloudflare.com) for ad-hoc remote previews
const tryCloudflareRegex = /^https?:\/\/[a-z0-9-]+\.trycloudflare\.com(?::\d+)?$/;

function isPrivateIp(ip) {
  const octets = ip.split(".").map((n) => Number(n));
  if (octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}
function isLanNipOrigin(origin) {
  try {
    const url = new URL(origin);
    if (!nipOriginRegex.test(origin)) return false;
    const ip = url.hostname.replace(/-/g, ".").replace(".nip.io", "");
    return isPrivateIp(ip);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl/server-to-server

      const isWhitelisted = allowedOrigins.includes(origin);
      const isLocalDev =
        NODE_ENV !== "production" &&
        (/^http:\/\/localhost(:\d+)?$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
          lanOriginRegex.test(origin) ||
          isLanNipOrigin(origin) ||
          tryCloudflareRegex.test(origin));

      if (isWhitelisted || isLocalDev) return callback(null, true);

      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Rate limiting (per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res
    .status(500)
    .json({ error: "Internal server error", detail: err.message || "unknown" });
});

const server = app.listen(PORT, () => {
  console.log(`TireStore backend running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `[startup] Port ${PORT} is already in use. Stop the existing process or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  console.error("[startup] Failed to start server:", err);
  process.exit(1);
});
