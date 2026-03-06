const express = require("express");
const axios = require("axios");
const router = express.Router();

const TIRE_API_BASE = "https://p511.eontyre.com/api/webshop/products";
const COMPLETE_WHEELS_API_BASE =
  "https://p511.eontyre.com/api/v2/products/export/complete-wheels";
const WEBSHOP_ID = process.env.WEBSHOP_ID || "38";
const API_KEY = process.env.API_KEY || "";

function toPositiveInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function buildCompleteWheelImageUrl(image) {
  if (!image?.image_id || !image?.filetype) return null;
  return `https://api.eontyre.com/images/${image.image_id}/big.${image.filetype}`;
}

function normaliseCompleteWheel(item) {
  const productId = Number(item?.product_id);
  const locationId = Number(item?.location_id);
  const supplierId = Number(item?.supplier_id);

  const safeProductId = Number.isFinite(productId) ? productId : 0;
  const safeLocationId = Number.isFinite(locationId) ? locationId : 0;
  const safeSupplierId = Number.isFinite(supplierId) ? supplierId : 0;

  const compositeId = `${safeProductId}:${safeLocationId}:${safeSupplierId}`;

  const images = Array.isArray(item?.images)
    ? item.images
        .map((image) => {
          const url = buildCompleteWheelImageUrl(image);
          return url ? { ...image, url } : null;
        })
        .filter(Boolean)
    : [];

  const tyreBrand = item?.tyre_brand_name || "";
  const rimBrand = item?.rim_brand_name || "";
  const title =
    item?.description ||
    [tyreBrand, item?.tyre_model_name, rimBrand, item?.rim_model_name]
      .filter(Boolean)
      .join(" ");

  return {
    ...item,
    id: compositeId,
    productId: safeProductId || null,
    orderProductId: safeProductId || null,
    orderSupplierId: safeSupplierId || null,
    orderLocationId: safeLocationId || null,
    name: title || "Complete wheel",
    brand: rimBrand || tyreBrand || item?.product_type_name || "Complete wheel",
    stock: item?.stock ?? 0,
    price: item?.price ?? null,
    width: item?.width ?? null,
    aspectRatio: item?.aspect_ratio ?? null,
    diameter: item?.diameter ?? null,
    images,
    imageUrl: images[0]?.url || null,
  };
}

function matchesCompleteWheelQuery(item, query) {
  if (!query) return true;
  const q = query.toLowerCase();

  const textParts = [
    item?.description,
    item?.supplier_description,
    item?.tyre_brand_name,
    item?.tyre_model_name,
    item?.rim_brand_name,
    item?.rim_model_name,
    item?.product_type_name,
    item?.vehicle_type_name,
    item?.rim_type_name,
    item?.supplier_name,
    item?.location_name,
    item?.supplier_product_id,
    item?.product_id,
    item?.ean,
  ];

  return textParts.some((part) =>
    String(part ?? "")
      .toLowerCase()
      .includes(q)
  );
}

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

// GET /api/products/complete-wheels — list complete wheels using export endpoint
router.get("/complete-wheels", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing API_KEY" });
    }

    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 24);
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    const minQuantityInStock = toPositiveInt(req.query.minQuantityInStock, 1);

    const params = new URLSearchParams();
    params.set("webshop_id", String(req.query.webshop_id || WEBSHOP_ID));
    params.set("minQuantityInStock", String(minQuantityInStock));
    if (req.query.customer_id) params.set("customer_id", String(req.query.customer_id));

    const url = `${COMPLETE_WHEELS_API_BASE}?${params.toString()}`;
    console.log(`[Complete Wheels] Fetching: ${url}`);

    const response = await axios.get(url, {
      timeout: 25000,
      headers: {
        Accept: "application/json",
        "User-Agent": "TireStore/1.0",
        "Api-Key": API_KEY,
        "api-key": API_KEY,
      },
    });

    const upstream = response.data || {};
    const source = Array.isArray(upstream?.data) ? upstream.data : [];
    const filtered = source.filter((item) => matchesCompleteWheelQuery(item, query));
    const count = filtered.length;

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit).map(normaliseCompleteWheel);

    return res.json({
      err: upstream?.err || null,
      count,
      page,
      limit,
      data: {
        products: items,
      },
    });
  } catch (err) {
    if (err.response) {
      console.error(
        "[Complete Wheels] API error:",
        err.response.status,
        err.response.data
      );
      return res.status(err.response.status).json({
        error: "Upstream complete-wheels API error",
        detail: err.response.data,
      });
    }

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request to complete-wheels API timed out" });
    }

    console.error("[Complete Wheels] Network error:", err.message);
    return res.status(502).json({
      error: "Could not reach complete-wheels API",
      detail: err.message,
    });
  }
});

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
