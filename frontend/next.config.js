/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
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
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
};

module.exports = nextConfig;
