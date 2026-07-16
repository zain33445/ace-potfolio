import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import LayoutShell from './layout-shell';

/* ── next/font (self-hosted, no external render-blocking requests) ── */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['500', '600', '700'],
});

const url = 'https://www.theaceservices.com';
const ogImage = 'https://www.theaceservices.com/og-image.png';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: 'ACE SERVICES — Pre-Construction Estimation',
    template: '%s | ACE SERVICES',
  },
  description:
    'Precision construction estimation and rapid quantity surveying platform. AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling.',
  keywords: [
    'construction estimation',
    'quantity surveying',
    'cost estimating',
    'material takeoffs',
    'pre-construction',
    'AACE',
    'CSI MasterFormat',
  ],
  openGraph: {
    type: 'website',
    siteName: 'ACE SERVICES',
    url: `${url}/`,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'ACE SERVICES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: `${url}/`,
  },
};

/* ── JSON-LD structured data ─────────────────────────────────── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ACE SERVICES',
  description:
    'Precision construction estimation and rapid quantity surveying platform.',
  url,
  foundingDate: '2025',
  areaServed: 'US',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dallas',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Pre-Construction Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cost Estimating' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Material Takeoffs' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Permit Sets' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Project Scheduling' } },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ACE SERVICES',
  url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${url}/?s={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does a construction estimate take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ACE SERVICES typically delivers detailed cost estimates within 3 to 5 business days depending on project complexity. Expedited 24-hour turnaround available for select scope categories.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Class 3 construction estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Class 3 estimate, as defined by AACE International, provides a budgetary control level of accuracy suitable for project funding authorization. ACE SERVICES delivers all estimates to AACE Class 3 standards with ±10% to ±20% accuracy range.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a quantity takeoff in construction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A quantity takeoff is the process of measuring and calculating all materials, labor, and equipment quantities from architectural blueprints and specifications. ACE SERVICES uses algorithmic digitization platforms for division-wise material volume counts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a construction cost estimate cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ACE SERVICES provides free preliminary quotes. Full estimate pricing is project-dependent based on square footage, scope complexity, and documentation quality. Use our online calculator for an instant budgetary allocation or contact us for a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'What tools does ACE use for estimating?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ACE SERVICES utilizes PlanSwift and Bluebeam for digitized quantity takeoffs along with proprietary cost-multiplier databases calibrated to localized material standards and CSI MasterFormat divisions.',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'ACE SERVICES Pre-Construction Process',
  description:
    'Our four-step pre-construction pipeline converts raw blueprints into certified cost schedules.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Structural Data Ingestion',
      text: 'Transmit your blueprints, architectural layouts, site measurements, scope narratives, or custom municipal constraints through our bank-grade secure server channel.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Algorithmic Quantity Takeoff',
      text: 'Our quantity surveyors perform exhaustive computational dissection utilizing localized material standards databases and professional digitization platforms.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Dual-Stage Verification Review',
      text: 'All programmatic estimates undergo parallel reviews by principal civil engineers to filter variances or localized market rate fluctuations before compilation.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Delivery Protocol Transmission',
      text: 'Instant delivery of final cost-schedules including completely interactive Microsoft Excel spreadsheets and stamped PDF dossiers designed for presentation.',
    },
  ],
};

/* ── Root Layout ─────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        
        {/* Montserrat Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        {/* Roboto Flex — used by TextPressure in Footer */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
        
        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
