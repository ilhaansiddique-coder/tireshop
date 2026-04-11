import axios from "axios";

export const apiClient = axios.create({
  baseURL: "",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ─── Products ──────────────────────────────────────────────
export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get("/api/products", { params });
  return data;
}

export async function fetchCompleteWheelProducts(params = {}) {
  const { data } = await apiClient.get("/api/products/complete-wheels", { params });
  return data;
}

export async function fetchRimProducts(params = {}) {
  const { data } = await apiClient.get("/api/products/rims-export", { params });
  return data;
}

export async function fetchTyresExport(params = {}) {
  const { data } = await apiClient.get("/api/products/tyres-export", { params });
  return data;
}

export async function fetchExtraProducts() {
  const { data } = await apiClient.get("/api/products/extras");
  return data;
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/api/products/${id}`);
  return data;
}

// ─── Brands ───────────────────────────────────────────────
export async function fetchBrands() {
  const { data } = await apiClient.get("/api/brands");
  return data;
}

// ─── Orders ────────────────────────────────────────────────
export async function createOrder(payload) {
  const { data } = await apiClient.post("/api/orders", payload);
  return data;
}

export async function fetchOrder(id) {
  const { data } = await apiClient.get(`/api/orders/${id}`);
  return data;
}

export async function listOrders(params = {}) {
  const { data } = await apiClient.get("/api/orders/list", { params });
  return data;
}

// ─── Stock ────────────────────────────────────────────────
export async function fetchStockExport(params = {}) {
  const { data } = await apiClient.get("/api/stock", { params });
  return data;
}

export async function fetchStockLocations() {
  const { data } = await apiClient.get("/api/stock/locations");
  return data;
}

// ─── Vehicles ─────────────────────────────────────────────
export async function fetchVehicleByPlate(platenumber) {
  const { data } = await apiClient.post(`/api/vehicles/${encodeURIComponent(platenumber)}`);
  return data;
}

// ─── Garages ──────────────────────────────────────────────
export async function fetchGarages(params = {}) {
  const { data } = await apiClient.get("/api/garages", { params });
  return data;
}

// ─── Tyre Hotels ──────────────────────────────────────────
export async function fetchTyrehotelsByPlate(licenseplate) {
  const { data } = await apiClient.get(`/api/tyrehotels/car/${encodeURIComponent(licenseplate)}`);
  return data;
}

export async function fetchTyrehotelDetail(id) {
  const { data } = await apiClient.get(`/api/tyrehotels/${id}`);
  return data;
}

// ─── Helpers ───────────────────────────────────────────────

/** Parse a dimension string like "205/55R16" into filter params */
export function parseDimension(str) {
  const clean = str.replace(/\s/g, "").toUpperCase();
  const match = clean.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
  if (!match) return null;
  return { width: match[1], aspectRatio: match[2], diameter: match[3] };
}

/**
 * Format a price in SEK.
 * The EONTYRE API returns all prices in öre (1/100 SEK).
 * Pass `isOre: true` (default) to auto-convert, or `false` if already in SEK.
 */
export function formatPrice(price, { inclVat = false, isOre = true } = {}) {
  if (!price && price !== 0) return "—";
  let sek = isOre ? Number(price) / 100 : Number(price);
  if (inclVat) sek *= 1.25;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(sek);
}

/** Convert öre to SEK number */
export function oreToSek(ore) {
  return Number(ore) / 100;
}

/** Map tyreType integer to a readable label */
export function seasonLabel(tyreType) {
  return { 1: "Winter", 2: "Summer", 3: "All Season" }[tyreType] || "—";
}

/** Map tyreType to a DaisyUI badge class */
export function seasonBadgeClass(tyreType) {
  return { 1: "badge-info", 2: "badge-warning", 3: "badge-success" }[tyreType] || "badge-ghost";
}

/** Build image URL from EONTYRE export API image object { image_id, filetype } */
export function buildEontyreImageUrl(imageObj) {
  if (!imageObj?.image_id || !imageObj?.filetype) return null;
  return `https://api.eontyre.com/images/${imageObj.image_id}/big.${imageObj.filetype}`;
}

/** Get the best available image URL from a product object (handles all API formats) */
export function productImageUrl(product) {
  // Already resolved URL
  if (product?.imageUrl) return product.imageUrl;

  // Search API format: image as string URL
  if (typeof product?.image === "string" && product.image) return product.image;

  // Search API format: image object with webshop_thumb/thumbnail/original
  if (product?.image?.webshop_thumb) return product.image.webshop_thumb;
  if (product?.image?.thumbnail) return product.image.thumbnail;
  if (product?.image?.original) return product.image.original;

  // Export API format: images array with { image_id, filetype }
  if (Array.isArray(product?.images) && product.images.length > 0) {
    const first = product.images[0];
    // If it already has a .url (normalised by backend)
    if (first?.url) return first.url;
    // Build from image_id + filetype
    const built = buildEontyreImageUrl(first);
    if (built) return built;
    // Search API: images as string array
    if (typeof first === "string") return first;
    if (first?.webshop_thumb) return first.webshop_thumb;
    if (first?.thumbnail) return first.thumbnail;
    if (first?.original) return first.original;
  }

  return product?.brandImageUrl || null;
}

/** Normalise a product response to a flat array */
export function normaliseProductsResponse(payload) {
  const products =
    payload?.products ||
    payload?.result?.products ||
    payload?.data?.products ||
    payload?.items ||
    (Array.isArray(payload?.data) ? payload.data : null) ||
    (Array.isArray(payload) ? payload : []);

  const total =
    payload?.totalCount ??
    payload?.total ??
    payload?.count ??
    payload?.result?.total ??
    payload?.result?.count ??
    payload?.data?.total ??
    payload?.data?.totalCount ??
    payload?.data?.count ??
    (Array.isArray(products) ? products.length : 0);

  return {
    products: Array.isArray(products) ? products : [],
    total: Number.isFinite(Number(total)) ? Number(total) : 0,
  };
}
