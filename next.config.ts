import type { NextConfig } from "next";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Allow opening the dev server via public IP / LAN host
  allowedDevOrigins: ["157.15.235.48", "127.0.0.1", "localhost","https://marketplace-be-b3ki.onrender.com"],
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
  // Proxy API through Next so browser calls are same-origin (visible in Network, no CORS).
  async rewrites() {
    if (!apiOrigin) return [];
    return [
      {
        source: "/backend/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
