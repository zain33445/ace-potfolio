/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ['motion', 'lucide-react', 'three', '@react-three/fiber'],
  },

  transpilePackages: [
    'three',
    '@react-three/fiber',
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

  async redirects() {
    return [
      {
        // Blog posts moved from /blog/:slug to root-level /:slug
        source: '/blog/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        // /about renamed to /about-us
        source: '/about',
        destination: '/about-us',
        permanent: true,
      },
      {
        // /contact renamed to /contact-us
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        // Portfolio moved from /samples (single WP page with tabs) to /projects
        // The WP site has no /samples/:slug URLs, so a single 301 covers it.
        source: '/samples',
        destination: '/projects',
        permanent: true,
      },
    ];
  },

  output: 'standalone',
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  async headers() {
    return [
      {
        // Default: strict security headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://cdn.botpress.cloud https://files.bpcontent.cloud",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://theaceservices.com https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms https://files.bpcontent.cloud",
              "frame-src https://docs.google.com",
              "object-src https://theaceservices.com",
              "base-uri 'self'",
              "form-action 'self'",
              "connect-src 'self' https://theaceservices.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://webchat.botpress.cloud wss://webchat.botpress.cloud",
              "manifest-src 'self'",
            ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
          },
        ],
      },
      {
        // Static pages: allow bfcache with must-revalidate
        source: '/(about-us|services|blog|projects|testimonials|privacy-policy|terms-and-conditions|contact-us|calculator)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Static API-like pages
        source: '/(robots.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

