import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000']
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
      },
      // Fallback for any other blob storage if needed (e.g. testing)
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
      }
    ],
  }
};

export default nextConfig;
