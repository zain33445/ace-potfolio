import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import LayoutShell from './layout-shell';
import ThirdPartyScripts from '@/src/components/ThirdPartyScripts';
import LiquidGlassFilter from '@/src/components/ui/liquid-glass-filter';
import {
  SITE_URL as url,
  OG_IMAGE as ogImage,
  websiteGraphSchema,
} from '../lib/schema';

/* ── next/font (self-hosted woff2, no external build/runtime requests) ── */

const inter = localFont({
  src: [
    { path: './fonts/google/inter/400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/google/inter/500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/google/inter/600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: [
    { path: './fonts/google/jetbrains-mono/400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/google/jetbrains-mono/500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/google/jetbrains-mono/700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: [
    { path: './fonts/google/space-grotesk/500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/google/space-grotesk/600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/google/space-grotesk/700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space',
  display: 'swap',
});

/* ── Nourd (self-hosted brand font for the logo) ── */

const nourd = localFont({
  src: [
    { path: './fonts/nourd/nourd_regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/nourd/nourd_medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/nourd/nourd_semi_bold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/nourd/nourd_bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/nourd/nourd_heavy.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-nourd',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: 'Construction Estimating Services | Cost Estimation & Material Takeoffs — The ACE Services',
    template: '%s | The ACE Services',
  },
  description:
    'The ACE Services delivers AACE Class 3 cost estimates, material takeoffs, and permit sets for general contractors across 35 US states. Bids in 24-48 hours.',
  keywords: [
    'construction estimating services',
    'construction cost estimation',
    'material takeoffs',
    'building cost estimator',
    'quantity surveying',
    'cost estimating',
    'pre-construction',
    'AACE',
    'CSI MasterFormat',
  ],
  openGraph: {
    type: 'website',
    siteName: 'The ACE Services',
    url: `${url}/`,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'The ACE Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
  icons: {
    icon: '/aceLogo.png',
  },
  alternates: {
    canonical: `${url}/`,
  },
};

/* ── Root Layout ─────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${nourd.variable}`}
    >
      <head>
        {/* JSON-LD structured data — single entity graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteGraphSchema) }}
        />

        {/* Preconnect to critical third-party origins (max 4 per Lighthouse) */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* Google Analytics 4 — deferred to after interactive to reduce main-thread work */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
        
        {/* Meta Pixel — deferred to after interactive */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script
            id="meta-pixel"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

      </head>
      <body className="min-h-screen antialiased selection:bg-primary selection:text-white" suppressHydrationWarning>

        <ThirdPartyScripts />
        <LiquidGlassFilter />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
