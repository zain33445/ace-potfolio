import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import LayoutShell from './layout-shell';
import ThirdPartyScripts from '@/src/components/ThirdPartyScripts';
import {
  SITE_URL as url,
  OG_IMAGE as ogImage,
  websiteGraphSchema,
} from '../lib/schema';

/* ── next/font (self-hosted woff2, no external build/runtime requests) ── */

const raleway = localFont({
  src: [
    { path: './fonts/google/raleway/300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/google/raleway/400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/google/raleway/500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/google/raleway/600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/google/raleway/700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-raleway',
  display: 'swap',
});

const montserrat = localFont({
  src: [
    { path: './fonts/google/montserrat/400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/google/montserrat/500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/google/montserrat/600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/google/montserrat/700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/google/montserrat/800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

/* ── Nourd (brand font — used on ServicesDashboard1, unused on homepage) ── */

/* ── Wosker (card title display font — unused) ── */

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: 'Construction Estimating Services | Cost Estimation & Material Takeoffs — The ACE Services',
    template: '%s | The ACE Services',
  },
  description:
    'The ACE Services delivers AACE Class 3 cost estimates, material takeoffs, and permit sets for general contractors across 35 US states. Cost estimates in 24-48 hours.',
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
    icon: '/aceLogo.webp',
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
      className={`${raleway.variable} ${montserrat.variable}`}
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

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W2L9L9PW');`}
        </Script>

        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2L9L9PW" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />

        <ThirdPartyScripts />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
