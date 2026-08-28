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
      {
        protocol: 'https',
        hostname: 'cms.theaceservices.com',
      },
    ],
  },

  async rewrites() {
    return [
      {
        // Legacy /wp-content/uploads/* URLs (from OLD WP install era) proxy
        // to cms subdomain so search-indexed image links continue to resolve.
        source: '/wp-content/uploads/:path*',
        destination: 'https://cms.theaceservices.com/wp-content/uploads/:path*',
      },
    ];
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
        // /services/:slug duplicates the canonical /:slug service route
        // ([slug]/page.tsx) — same content, two indexable URLs. Nothing on
        // the site links to /services/:slug except itself; consolidate.
        source: '/services/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        // "Pauma Travel Center" was entered twice in the CMS during
        // extraction (same PDF, same content) — collapse into one page.
        source: '/projects/pauma-travel-center-2',
        destination: '/projects/pauma-travel-center',
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
      {
        // WP page slug "home" is a second, fully indexable, self-canonical
        // homepage competing with the real one at "/" — direct duplicate
        // content on the site's single most important URL. Collapse it.
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        // WP page slug "terms-conditions" duplicates "/terms-and-conditions",
        // which is the version actually linked and in the sitemap.
        source: '/terms-conditions',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        // Duplicate blog post consolidated — WP created "-2" variants when the
        // same post was published twice. Deleted the -2 versions from CMS and
        // redirect any lingering inbound links here.
        source: '/industrial-estimation-the-complete-guide-for-us-contractors-2',
        destination: '/industrial-estimation-the-complete-guide-for-us-contractors',
        permanent: true,
      },
      {
        source: '/exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers-2',
        destination: '/exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers',
        permanent: true,
      },
      {
        source: '/residential-construction-estimation-save-thousands-2',
        destination: '/residential-construction-estimation-save-thousands',
        permanent: true,
      },
      {
        // /test-post is a leftover WP test artifact (empty meta description,
        // no real content) that was live and indexed. next.config.js
        // redirects() can't emit 410 Gone (preferred for intentional
        // removal), so send it to /blog as the closest relevant page — a
        // 301 still gets it deindexed and out of the sitemap (see sitemap.ts).
        source: '/test-post',
        destination: '/blog',
        permanent: true,
      },
    ];
  },

  productionBrowserSourceMaps: false,
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
              "img-src 'self' data: https://theaceservices.com https://cms.theaceservices.com https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms https://files.bpcontent.cloud",
              "frame-src https://docs.google.com",
              "object-src https://theaceservices.com https://cms.theaceservices.com",
              "base-uri 'self'",
              "form-action 'self'",
              "connect-src 'self' https://theaceservices.com https://cms.theaceservices.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://webchat.botpress.cloud wss://webchat.botpress.cloud",
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

