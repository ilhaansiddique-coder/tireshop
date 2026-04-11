const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "https://p511.eontyre.com";
const WEBSHOP_ID = process.env.WEBSHOP_ID || "38";
const API_KEY = process.env.API_KEY || "";

function getAuthHeaders() {
  return {
    Accept: "application/json",
    "User-Agent": "TireStore/1.0",
    "Api-Key": API_KEY,
    "api-key": API_KEY,
  };
}

// GET /api/stock/export — stock amounts
router.get("/export", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const params = new URLSearchParams();
    if (req.query.webshop) params.set("webshop", req.query.webshop);
    else params.set("webshop", WEBSHOP_ID);

    const url = `${API_BASE}/api/v2/stock/export?${params.toString()}`;
    const response = await axios.get(url, { timeout: 20000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream stock API error", detail: err.response.data });
    if (err.code === "ECONNABORTED") return res.status(504).json({ error: "Stock API timed out" });
    res.status(502).json({ error: "Could not reach stock API", detail: err.message });
  }
});

// GET /api/stock/locations — warehouse locations
router.get("/locations", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/stock/locations`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach stock locations API", detail: err.message });
  }
});

// GET /api/stock/positions — stock positions (shelves)
router.get("/positions", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const params = new URLSearchParams();
    if (req.query.location) params.set("location", req.query.location);

    const url = `${API_BASE}/api/stock/positions?${params.toString()}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach stock positions API", detail: err.message });
  }
});

// GET /api/stock/positions/:id — single stock position
router.get("/positions/:id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/stock/positions/${req.params.id}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach stock position API", detail: err.message });
  }
});

// GET /api/stock/positions/:id/tyrehotel — tyre hotels for a stock position
router.get("/positions/:id/tyrehotel", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/stock/positions/${req.params.id}/tyrehotel`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach tyrehotel API", detail: err.message });
  }
});

// GET /api/stock/suggest/tyrehotel — suggest stock positions for tyre hotel wheels
router.get("/suggest/tyrehotel", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const params = new URLSearchParams();
    if (req.query.location) params.set("location", req.query.location);
    if (req.query.tyrehotel) params.set("tyrehotel", req.query.tyrehotel);
    if (req.query.season) params.set("season", req.query.season);

    const url = `${API_BASE}/api/stock/suggest/tyrehotel?${params.toString()}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach suggest API", detail: err.message });
  }
});

module.exports = router;
