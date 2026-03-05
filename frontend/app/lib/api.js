// Dynamically resolve API host so the app works when accessed via a LAN IP
// (e.g. http://192.168.0.127:3000) as well as localhost.
function getApiBase() {
  if (typeof window !== "undefined") {
    // Same hostname as the frontend, backend always on port 4000
    return `http://${window.location.hostname}:4000`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

/**
 * Fetch tire products from backend
 * @param {Object} filters - filter params
 * @returns {Promise<{products: Array, total: number, page: number, pages: number}>}
 */
export async function fetchProducts(filters = {}) {
  const API_BASE = getApiBase();
  const params = new URLSearchParams();

  // Defaults
  const defaults = {
    page: 1,
    limit: 24,
    typeId: 1,
    tyreType: 2,
    vehicleType: "alla",
    searchMode: 4,
    showNoimageRims: 1,
    showNoimageTyres: 1,
    minQuantityInStock: 4,
    minimumTestScore: 0,
    loadIndex: 0,
    loadIndexRear: 0,
    isElectricVehicle: false,
    isEnforced: false,
    isMCVehicleType: false,
    isRunflat: false,
    isSilence: false,
    isStaggeredFitment: false,
  };

  const merged = { ...defaults, ...filters };

  Object.entries(merged).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && !Array.isArray(val)) {
      params.set(key, val);
    }
  });

  // Handle array params
  const locations = filters["includeLocations[]"] || ["1048"];
  (Array.isArray(locations) ? locations : [locations]).forEach((l) =>
    params.append("includeLocations[]", l)
  );

  if (filters["tyreDimensions[]"]) {
    const dims = filters["tyreDimensions[]"];
    (Array.isArray(dims) ? dims : [dims]).forEach((d) =>
      params.append("tyreDimensions[]", d)
    );
  }

  const url = `${API_BASE}/api/products?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a single product by ID
 * @param {string|number} id
 */
export async function fetchProductById(id) {
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Product ${id} not found`);
  return res.json();
}

/**
 * Create order through backend proxy.
 * @param {Object} payload
 */
export async function createOrder(payload) {
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail?.err || data?.err || data?.error || `HTTP ${res.status}`);
  }
  if (data?.err) {
    throw new Error(data.err);
  }
  return data;
}

/**
 * Fetch an order by ID through backend proxy.
 * @param {string|number} id
 */
export async function fetchOrderById(id) {
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/orders/${id}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail?.err || data?.err || data?.error || `HTTP ${res.status}`);
  }
  return data;
}
