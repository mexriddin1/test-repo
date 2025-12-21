import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', '946d3a41929e.ngrok-free.app'],
    unoptimized: true,
  },
};

export default nextConfig;
