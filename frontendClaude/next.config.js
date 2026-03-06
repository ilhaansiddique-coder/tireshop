/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: {
    buildActivity: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "p511.eontyre.com" },
      { protocol: "https", hostname: "api.eontyre.com" },
      { protocol: "https", hostname: "*.eontyre.com" },
    ],
  },
};

module.exports = nextConfig;
