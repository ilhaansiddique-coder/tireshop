module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/api/_lib/proxy.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "proxyToBackend",
    ()=>proxyToBackend
]);
const DEFAULT_BACKEND_URL = "http://127.0.0.1:4000";
function getBackendBase() {
    const fromEnv = process.env.BACKEND_API_URL || process.env.INTERNAL_API_URL;
    return (fromEnv || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}
function buildTargetUrl(pathname, searchParams) {
    const url = new URL(`${getBackendBase()}${pathname}`);
    searchParams?.forEach((value, key)=>{
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
async function proxyToBackend(request, pathname) {
    try {
        const targetUrl = buildTargetUrl(pathname, request.nextUrl.searchParams);
        const method = request.method || "GET";
        const headers = copyHeaders(request.headers);
        const init = {
            method,
            headers,
            cache: "no-store"
        };
        if (![
            "GET",
            "HEAD"
        ].includes(method)) {
            init.body = await request.text();
        }
        const upstream = await fetch(targetUrl, init);
        const text = await upstream.text();
        return new Response(text, {
            status: upstream.status,
            headers: {
                "content-type": upstream.headers.get("content-type") || "application/json"
            }
        });
    } catch (error) {
        return Response.json({
            error: "Proxy request failed",
            detail: error?.message || "Unknown proxy error"
        }, {
            status: 502
        });
    }
}
}),
"[project]/app/api/products/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/proxy.js [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
async function GET(request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["proxyToBackend"])(request, "/api/products");
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cccd765e._.js.map