import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev server via public IP / LAN host
  allowedDevOrigins: ["157.15.235.48", "127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "media-assets.swiggy.com",
      },
    ],
  },
};

export default nextConfig;
