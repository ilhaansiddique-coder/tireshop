const DEFAULT_BACKEND_URL = "http://127.0.0.1:4000";

function getBackendBase() {
  const fromEnv =
    process.env.BACKEND_API_URL ||
    process.env.INTERNAL_API_URL;
  return (fromEnv || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

function buildTargetUrl(pathname, searchParams) {
  const url = new URL(`${getBackendBase()}${pathname}`);
  searchParams?.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  return url;
}

function copyHeaders(sourceHeaders) {
  const headers = {};
  const contentType = sourceHeaders.get("content-type");
  const accept = sourceHeaders.get("accept");
  if (contentType) headers["content-type"] = contentType;
  if (accept) headers.accept = accept;
  return headers;
}

export async function proxyToBackend(request, pathname) {
  try {
    const targetUrl = buildTargetUrl(pathname, request.nextUrl.searchParams);
    const method = request.method || "GET";
    const headers = copyHeaders(request.headers);

    const init = {
      method,
      headers,
      cache: "no-store",
    };

    if (!["GET", "HEAD"].includes(method)) {
      init.body = await request.text();
    }

    const upstream = await fetch(targetUrl, init);
    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Proxy request failed",
        detail: error?.message || "Unknown proxy error",
      },
      { status: 502 }
    );
  }
}
