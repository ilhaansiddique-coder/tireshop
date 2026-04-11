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

// GET /api/tyrehotels/car/:licenseplate — get tyre hotels by license plate
router.get("/car/:licenseplate", async (req, res) => {
  try {
    const { licenseplate } = req.params;
    const url = `${API_BASE}/api/car/${encodeURIComponent(licenseplate)}/tyrehotels`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Tyrehotel lookup failed", detail: err.response.data });
    res.status(502).json({ error: "Could not reach tyrehotel API", detail: err.message });
  }
});

// GET /api/tyrehotels/:id — get tyre hotel details
router.get("/:id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/tyrehotels/${req.params.id}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Tyrehotel API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach tyrehotel API", detail: err.message });
  }
});

// POST /api/tyrehotels/:hotel_id/wheels — add tyre to hotel
router.post("/:hotel_id/wheels", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/tyrehotels/${req.params.hotel_id}/wheels`;
    const response = await axios.post(url, req.body, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Tyrehotel add tyre failed", detail: err.response.data });
    res.status(502).json({ error: "Could not reach tyrehotel API", detail: err.message });
  }
});

// POST /api/tyrehotels/:hotel_id/wheels/:wheel_id — update tyre in hotel
router.post("/:hotel_id/wheels/:wheel_id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/tyrehotels/${req.params.hotel_id}/wheels/${req.params.wheel_id}`;
    const response = await axios.post(url, req.body, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Tyrehotel update tyre failed", detail: err.response.data });
    res.status(502).json({ error: "Could not reach tyrehotel API", detail: err.message });
  }
});

module.exports = router;
