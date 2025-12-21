import type { NextConfig } from "next";

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL || process.env.BACKEND_URL || "http://185.191.141.85:8080";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '185.191.141.85', port: '8080', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.example.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '', pathname: '/**' },
    ],
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND}/:path*`, // Proxy all /api requests to backend
      },
    ];
  },
};

export default nextConfig;
