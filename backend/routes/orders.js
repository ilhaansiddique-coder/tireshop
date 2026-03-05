const express = require("express");
const axios = require("axios");

const router = express.Router();

const ORDER_API_BASE =
  process.env.ORDER_API_BASE || "https://p511.eontyre.com/api/v2/orders";
const WEBSHOP_ID = process.env.WEBSHOP_ID || "38";
const API_KEY = process.env.API_KEY || "";
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN;

function getAuthHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "TireStore/1.0",
    // Some EONTYRE endpoints use Api-Key, others accept api-key.
    "Api-Key": API_KEY,
    "api-key": API_KEY,
  };
}

// Optional simple auth for server-to-server calls
router.use((req, res, next) => {
  if (!INTERNAL_API_TOKEN) return next(); // disabled when not set

  const token = req.headers["x-internal-token"];
  if (token === INTERNAL_API_TOKEN) return next();

  return res.status(401).json({ error: "Unauthorized" });
});

router.post("/", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    const payload = {
      ...req.body,
      webshop_id: req.body?.webshop_id ?? Number(WEBSHOP_ID),
    };

    const response = await axios.post(ORDER_API_BASE, payload, {
      timeout: 20000,
      headers: getAuthHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        error: "Upstream order API error",
        detail: err.response.data,
      });
    }
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request to order API timed out" });
    }
    res.status(502).json({ error: "Could not reach order API", detail: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    const { id } = req.params;
    const url = `${ORDER_API_BASE}/${id}`;
    const response = await axios.get(url, {
      timeout: 15000,
      headers: getAuthHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        error: "Upstream order API error",
        detail: err.response.data,
      });
    }
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request to order API timed out" });
    }
    res.status(502).json({ error: "Could not reach order API", detail: err.message });
  }
});

module.exports = router;
