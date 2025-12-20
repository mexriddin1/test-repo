import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow loading images served from local backend during development
    domains: ['localhost', '127.0.0.1'],
    // disable the built-in image optimization during development so Next.js
    // doesn't attempt to proxy localhost-hosted images (which resolve to
    // private IPs and are blocked). This makes `next/image` render the
    // provided src directly.
    unoptimized: true,
  },
};

export default nextConfig;
