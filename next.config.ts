import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        destination: '/api/media/:path*',
        source: '/media/:path*',
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
