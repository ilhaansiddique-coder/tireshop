import { proxyToBackend } from "../../_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { platenumber } = await params;
  return proxyToBackend(request, `/api/vehicles/${platenumber}`);
}
