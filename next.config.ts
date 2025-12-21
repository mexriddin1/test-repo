import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'http://185.191.141.85:8080'],
    unoptimized: true,
  },
};

export default nextConfig;
