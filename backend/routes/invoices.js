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

// GET /api/invoices/:id — get info about invoice
router.get("/:id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/v2/invoices/${req.params.id}`;
    const response = await axios.get(url, { timeout: 15000, headers: getAuthHeaders() });
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Invoice API error", detail: err.response.data });
    res.status(502).json({ error: "Could not reach invoice API", detail: err.message });
  }
});

// GET /api/invoices/:id/pdf — download invoice PDF
router.get("/:id/pdf", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing API_KEY" });

    const url = `${API_BASE}/api/v2/invoices/${req.params.id}/pdf`;
    const response = await axios.get(url, {
      timeout: 20000,
      headers: getAuthHeaders(),
      responseType: "arraybuffer",
    });

    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="invoice-${req.params.id}.pdf"`);
    res.send(Buffer.from(response.data));
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: "Invoice PDF error", detail: String(err.response.data) });
    res.status(502).json({ error: "Could not reach invoice API", detail: err.message });
  }
});

module.exports = router;
