const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // next is hoisted to monorepo root node_modules
    root: path.resolve(__dirname, ".."),
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
