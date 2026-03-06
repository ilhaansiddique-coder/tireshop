import { proxyToBackend } from "../_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(request) {
  return proxyToBackend(request, "/api/orders");
}
