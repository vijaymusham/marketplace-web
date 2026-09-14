import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Allow opening the dev server via public IP / LAN host
  allowedDevOrigins: ["157.15.235.48", "127.0.0.1", "localhost","https://marketplace-be-b3ki.onrender.com"],
  // Tree-shake heavy icon / animation barrels from the critical client graph.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
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
  async redirects() {
    return [
      {
        source: "/olx-alternative",
        destination: "/free-classifieds",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://maps.googleapis.com https://maps.gstatic.com https://www.gstatic.com https://apis.google.com https://accounts.google.com",
      "connect-src 'self' https: wss: http://localhost:* http://127.0.0.1:*",
      "frame-src 'self' https://www.google.com https://maps.googleapis.com https://accounts.google.com https://apis.google.com https://*.firebaseapp.com https://*.google.com",
      "worker-src 'self' blob:",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; ");

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
      { key: "Content-Security-Policy", value: csp },
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "deal-pokket",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
