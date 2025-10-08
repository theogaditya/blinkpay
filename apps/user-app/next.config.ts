import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
   transpilePackages: ['@repo/db'],
   runtime: 'nodejs',
};

export default nextConfig;

