import { proxyToBackend } from "../../_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  return proxyToBackend(request, `/api/orders/${encodeURIComponent(params.id)}`);
}
