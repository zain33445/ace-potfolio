/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ['motion', 'lucide-react', 'three', '@react-three/fiber', '@react-three/drei'],
  },

  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'lenis',
  ],

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

  output: 'standalone',

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://theaceservices.com https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "connect-src 'self' https://theaceservices.com https://www.google-analytics.com",
              "manifest-src 'self'",
            ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), document-domain=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

