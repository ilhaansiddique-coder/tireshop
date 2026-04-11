const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "https://p511.eontyre.com";
const API_KEY = process.env.API_KEY || "";

function getAuthHeaders() {
  return {
    Accept: "application/json",
    "User-Agent": "TireStore/1.0",
    "Api-Key": API_KEY,
    "api-key": API_KEY,
  };
}

// GET /api/prices/export — price list
router.get("/export", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const params = new URLSearchParams();
    if (req.query.since) params.set("since", req.query.since);
    if (req.query.customerId) params.set("customerId", req.query.customerId);
    if (req.query.productId) params.set("productId", req.query.productId);
    if (req.query.supplierIds) {
      const ids = Array.isArray(req.query.supplierIds) ? req.query.supplierIds : [req.query.supplierIds];
      ids.forEach((id) => params.append("supplierIds[]", id));
    }

    const url = `${API_BASE}/api/v2/prices/export?${params.toString()}`;
    const response = await axios.get(url, { timeout: 20000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream prices API error", detail: err.response.data });
    if (err.code === "ECONNABORTED") return res.status(504).json({ error: "Prices API timed out" });
    res.status(502).json({ error: "Could not reach prices API", detail: err.message });
  }
});

module.exports = router;
