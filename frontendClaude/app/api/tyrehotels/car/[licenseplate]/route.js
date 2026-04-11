import { proxyToBackend } from "../../../_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { licenseplate } = await params;
  return proxyToBackend(request, `/api/tyrehotels/car/${licenseplate}`);
}
