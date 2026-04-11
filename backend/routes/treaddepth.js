const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "https://p511.eontyre.com";
const API_KEY = process.env.API_KEY || "";

function getAuthHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "TireStore/1.0",
    "Api-Key": API_KEY,
    "api-key": API_KEY,
  };
}

// GET /api/treaddepth/:id — get tread depth reading
router.get("/:id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/threaddepth/${req.params.id}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "TreadDepth API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach treaddepth API", detail: err.message });
  }
});

// POST /api/treaddepth — register a new tread depth reading
router.post("/", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/threaddepth`;
    const response = await axios.post(url, req.body, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "TreadDepth API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach treaddepth API", detail: err.message });
  }
});

module.exports = router;
