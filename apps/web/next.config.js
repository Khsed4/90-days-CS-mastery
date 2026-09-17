/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',   // enables lean Docker runtime (no node_modules at run time)
  reactStrictMode: true,
  transpilePackages: [
    '@shared/contracts',
    '@shared/types',
    '@shared/constants',
    '@shared/utils',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
};

module.exports = nextConfig;
