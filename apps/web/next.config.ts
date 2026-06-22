import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
  transpilePackages: ["@cal-market/db", "@cal-market/agent-core"],
};

export default nextConfig;
