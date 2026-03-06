/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Allow LAN/dev proxy origins to fetch internal /_next resources in development.
  allowedDevOrigins: ["192.168.0.127", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p511.eontyre.com",
      },
      {
        protocol: "https",
        hostname: "api.eontyre.com",
      },
      {
        protocol: "https",
        hostname: "*.eontyre.com",
      },
    ],
  },
};

module.exports = nextConfig;
