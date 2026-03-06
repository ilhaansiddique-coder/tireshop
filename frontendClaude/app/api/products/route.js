import { proxyToBackend } from "../_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return proxyToBackend(request, "/api/products");
}
