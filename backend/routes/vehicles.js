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

// POST /api/vehicles/:platenumber — get car info by plate number
router.post("/:platenumber", async (req, res) => {
  try {
    const { platenumber } = req.params;
    const url = `${API_BASE}/api/webshop/cars/${encodeURIComponent(platenumber)}`;

    const response = await axios.post(url, req.body || {}, {
      timeout: 15000,
      headers: getAuthHeaders(),
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Vehicle lookup failed", detail: err.response.data });
    if (err.code === "ECONNABORTED") return res.status(504).json({ error: "Vehicle API timed out" });
    res.status(502).json({ error: "Could not reach vehicle API", detail: err.message });
  }
});

module.exports = router;
