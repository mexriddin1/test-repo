import type { NextConfig } from "next";

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL || process.env.BACKEND_URL || "https://api.realdreamsuz.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'api.realdreamsuz', port: '8080', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '', pathname: '/**' },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND}/:path*`, // Proxy all /api requests to backend
      },
      {
        source: '/cars/:path*',
        destination: `${BACKEND}/cars/:path*`, // Proxy cars endpoints
      },
      {
        source: '/cars',
        destination: `${BACKEND}/cars`,
      },
      {
        source: '/car-bookings/:path*',
        destination: `${BACKEND}/car-bookings/:path*`,
      },
      {
        source: '/car-bookings',
        destination: `${BACKEND}/car-bookings`,
      },
    ];
  },
};

export default nextConfig;
