import axios from "axios";

export const apiClient = axios.create({
  // Use Next.js same-origin API routes in dev/prod to avoid stale external tunnel URLs.
  baseURL: "",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ─── Products ──────────────────────────────────────────────
export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get("/api/products", { params });
  return data;
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/api/products/${id}`);
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

// ─── Helpers ───────────────────────────────────────────────

/** Parse a dimension string like "205/55R16" into filter params */
export function parseDimension(str) {
  const clean = str.replace(/\s/g, "").toUpperCase();
  const match = clean.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
  if (!match) return null;
  return { width: match[1], aspectRatio: match[2], diameter: match[3] };
}

/** Format a price in SEK */
export function formatPrice(price, inclVat = false) {
  if (!price && price !== 0) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(inclVat ? price * 1.25 : price);
}

/** Map tyreType integer to a readable label */
export function seasonLabel(tyreType) {
  return { 1: "Winter", 2: "Summer", 3: "All Season" }[tyreType] || "—";
}

/** Map tyreType to a DaisyUI badge class */
export function seasonBadgeClass(tyreType) {
  return { 1: "badge-info", 2: "badge-warning", 3: "badge-success" }[tyreType] || "badge-ghost";
}

/** Get the best available image URL from a product object */
export function productImageUrl(product) {
  return (
    product?.imageUrl ||
    product?.images?.[0]?.url ||
    product?.brandImageUrl ||
    null
  );
}
