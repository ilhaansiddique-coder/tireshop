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

// GET /api/orders — list orders for a customer
router.get("/", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const params = new URLSearchParams();
    if (req.query.customer_id) params.set("customer_id", req.query.customer_id);
    if (req.query.page) params.set("page", req.query.page);
    if (req.query.limit) params.set("limit", req.query.limit);
    if (req.query.query) params.set("query", req.query.query);
    if (req.query.delivered) params.set("delivered", req.query.delivered);

    const url = `https://p511.eontyre.com/api/webshop/orders?${params.toString()}`;
    const response = await axios.get(url, {
      timeout: 15000,
      headers: getAuthHeaders(),
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream orders list error", detail: err.response.data });
    if (err.code === "ECONNABORTED") return res.status(504).json({ error: "Orders list API timed out" });
    res.status(502).json({ error: "Could not reach orders API", detail: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    // Validate required fields before sending to EONTYRE
    const customer = req.body?.customer;
    if (!customer?.name || !customer?.phone || !customer?.email) {
      return res.status(400).json({
        error: "Missing required customer fields",
        detail: "name, phone, and email are required",
      });
    }
    if (!customer?.postal_code || !customer?.city || !customer?.country) {
      return res.status(400).json({
        error: "Missing required address fields",
        detail: "postal_code, city, and country are required",
      });
    }
    if (!Array.isArray(req.body?.products) || req.body.products.length === 0) {
      return res.status(400).json({
        error: "No products in order",
        detail: "At least one product is required",
      });
    }

    const payload = {
      ...req.body,
      webshop_id: req.body?.webshop_id ?? Number(WEBSHOP_ID),
    };

    console.log("[Orders] Creating order:", JSON.stringify({
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      products: payload.products,
      delivery_option: payload.delivery_option,
    }));

    const response = await axios.post(ORDER_API_BASE, payload, {
      timeout: 20000,
      headers: getAuthHeaders(),
    });

    if (response.data?.err) {
      console.error("[Orders] EONTYRE returned error:", response.data.err);
      return res.status(422).json({
        error: response.data.err,
        detail: response.data,
      });
    }

    console.log("[Orders] Order created:", response.data?.data?.id);
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      const detail = err.response.data;
      console.error("[Orders] Upstream error:", err.response.status, JSON.stringify(detail));
      const message = detail?.err || detail?.error || "Order rejected by EONTYRE";
      return res.status(err.response.status).json({ error: message, detail });
    }
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request to order API timed out" });
    }
    console.error("[Orders] Network error:", err.message);
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
