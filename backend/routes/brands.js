const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "https://p511.eontyre.com";
const API_KEY = process.env.API_KEY || "";

// GET /api/brands — product brands for webshop
router.get("/", async (req, res) => {
  try {
    // EONTYRE brands endpoint requires /api prefix and session cookie
    const url = `${API_BASE}/api/webshop/brands`;
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "User-Agent": "TireStore/1.0",
        "api-key": API_KEY,
        "Api-Key": API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Upstream brands API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach brands API", detail: err.message });
  }
});

module.exports = router;
