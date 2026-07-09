/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Transpile Three.js ecosystem packages (they ship un-transpiled ESM)
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'lenis',
  ],

  // Path alias: @ → project root (mirrors the old Vite alias)
  webpack(config) {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'theaceservices.com',
      },
    ],
  },

  // Allow the project to be statically exported for Vercel
  output: 'standalone',
};

module.exports = nextConfig;
