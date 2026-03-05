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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl/server-to-server

      const isWhitelisted = allowedOrigins.includes(origin);
      const isLocalDev =
        NODE_ENV !== "production" &&
        (/^http:\/\/localhost(:\d+)?$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin));

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

app.listen(PORT, () => {
  console.log(`🚀 TireStore backend running on http://localhost:${PORT}`);
});
