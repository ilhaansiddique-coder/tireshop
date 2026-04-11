const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "https://p511.eontyre.com";
const API_KEY = process.env.API_KEY || "";

// GET /api/garages — get garages
router.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.set("version", "2");
    if (req.query.postalCode) params.set("postalCode", req.query.postalCode);

    const url = `${API_BASE}/webshop/garages?${params.toString()}`;
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
    if (err.response) return res.status(err.response.status).json({ error: "Garages API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach garages API", detail: err.message });
  }
});

module.exports = router;
