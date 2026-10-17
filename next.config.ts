import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['cheerio'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
