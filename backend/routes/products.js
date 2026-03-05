const express = require("express");
const axios = require("axios");
const router = express.Router();

const TIRE_API_BASE = "https://p511.eontyre.com/api/webshop/products";
const WEBSHOP_ID = process.env.WEBSHOP_ID || "38";
const API_KEY = process.env.API_KEY || "";

// Build query params from request, applying defaults
function buildApiParams(query) {
  const params = new URLSearchParams();

  // Core / always-present params
  params.set("webshopId", WEBSHOP_ID);
  params.set("version", query.version || "2");
  params.set("typeId", query.typeId || "1");
  params.set("tyreType", query.tyreType || "2");
  params.set("vehicleType", query.vehicleType || "alla");
  params.set("searchMode", query.searchMode || "4");
  params.set("showNoimageRims", query.showNoimageRims ?? "1");
  params.set("showNoimageTyres", query.showNoimageTyres ?? "1");
  params.set("limit", query.limit || "24");
  params.set("page", query.page || "1");
  params.set("minQuantityInStock", query.minQuantityInStock || "4");
  params.set("minimumTestScore", query.minimumTestScore || "0");
  params.set("loadIndex", query.loadIndex || "0");
  params.set("loadIndexRear", query.loadIndexRear || "0");
  params.set("isElectricVehicle", query.isElectricVehicle || "false");
  params.set("isEnforced", query.isEnforced || "false");
  params.set("isMCVehicleType", query.isMCVehicleType || "false");
  params.set("isRunflat", query.isRunflat || "false");
  params.set("isSilence", query.isSilence || "false");
  params.set("isStaggeredFitment", query.isStaggeredFitment || "false");

  // Optional filters
  if (query.query) params.set("query", query.query);
  if (query.diameter) params.set("diameter", query.diameter);
  if (query.width) params.set("width", query.width);
  if (query.aspectRatio) params.set("aspectRatio", query.aspectRatio);
  if (query.speedIndex) params.set("speedIndex", query.speedIndex);
  if (query.rollingResistance) params.set("rollingResistance", query.rollingResistance);
  if (query.wetGrip) params.set("wetGrip", query.wetGrip);
  if (query.noiseEmissionDecibel) params.set("noiseEmissionDecibel", query.noiseEmissionDecibel);
  if (query.carApprovalMark) params.set("carApprovalMark", query.carApprovalMark);
  if (query.comment) params.set("comment", query.comment);
  if (query.vehicleId) params.set("vehicleId", query.vehicleId);

  // Array params: includeLocations
  const locations = query["includeLocations[]"]
    ? Array.isArray(query["includeLocations[]"])
      ? query["includeLocations[]"]
      : [query["includeLocations[]"]]
    : ["1048"];
  locations.forEach((loc) => params.append("includeLocations[]", loc));

  // Array params: tyreDimensions
  if (query["tyreDimensions[]"]) {
    const dims = Array.isArray(query["tyreDimensions[]"])
      ? query["tyreDimensions[]"]
      : [query["tyreDimensions[]"]];
    dims.forEach((d) => params.append("tyreDimensions[]", d));
  }

  return params;
}

// GET /api/products — fetch tire listings
router.get("/", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    const params = buildApiParams(req.query);
    const url = `${TIRE_API_BASE}?${params.toString()}`;

    console.log(
      `[Products] Fetching: ${url} | key set: ${API_KEY ? "yes" : "no"}`
    );

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "User-Agent": "TireStore/1.0",
        "api-key": API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error("[Products] API error:", err.response.status, err.response.data);
      res.status(err.response.status).json({
        error: "Upstream API error",
        detail: err.response.data,
      });
    } else if (err.code === "ECONNABORTED") {
      res.status(504).json({ error: "Request to tire API timed out" });
    } else {
      console.error("[Products] Network error:", err.message);
      res.status(502).json({ error: "Could not reach tire API", detail: err.message });
    }
  }
});

// GET /api/products/:id — fetch single product detail
router.get("/:id", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    const { id } = req.params;
    const url = `https://p511.eontyre.com/api/webshop/products/${id}?webshopId=${WEBSHOP_ID}&version=2`;

    console.log(`[Product Detail] Fetching: ${url}`);

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "User-Agent": "TireStore/1.0",
        "api-key": API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({ error: "Product not found", detail: err.response.data });
    } else {
      res.status(502).json({ error: "Could not reach tire API", detail: err.message });
    }
  }
});

module.exports = router;
