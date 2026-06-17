/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  webpack: (config) => {
    // clean-css (used client-side by the CSS Minifier tool) optionally requires
    // Node's `fs` module for inline source maps, which has no browser equivalent.
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  async headers() {
    // Next already serves /_next/static assets (JS/CSS chunks, self-hosted
    // fonts) with long-lived immutable Cache-Control headers automatically.
    // These apply security headers to every route on top of that.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
