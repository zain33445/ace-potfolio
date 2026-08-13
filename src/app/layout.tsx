import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import LayoutShell from './layout-shell';
import ThirdPartyScripts from '@/src/components/ThirdPartyScripts';

/* ── next/font (self-hosted, no external render-blocking requests) ── */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['500', '600', '700'],
  display: 'swap',
});

/* ── Nourd (self-hosted brand font for the logo) ── */

const nourd = localFont({
  src: [
    { path: './fonts/nourd/nourd_light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/nourd/nourd_regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/nourd/nourd_medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/nourd/nourd_semi_bold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/nourd/nourd_bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/nourd/nourd_heavy.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-nourd',
  display: 'swap',
});

const url = 'https://www.theaceservices.com';
const ogImage = 'https://www.theaceservices.com/og-image.png';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: 'Construction Estimating Services | Cost Estimation & Material Takeoffs — The ACE Services',
    template: '%s | The ACE Services',
  },
  description:
    'The ACE Services delivers professional construction estimating services including AACE Class 3 cost estimates, material takeoffs, and permit sets for general contractors across 35 US states. Get accurate bids in 24-48 hours.',
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

/* ── JSON-LD structured data ─────────────────────────────────── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The ACE Services',
  description:
    'The ACE Services is a top construction and estimation company delivering AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide.',
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
  name: 'The ACE Services',
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
        text: 'The ACE Services typically delivers detailed cost estimates within 3 to 5 business days depending on project complexity. Expedited 24-hour turnaround available for select scope categories.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Class 3 construction estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Class 3 estimate, as defined by AACE International, provides a budgetary control level of accuracy suitable for project funding authorization. The ACE Services delivers all estimates to AACE Class 3 standards with ±10% to ±20% accuracy range.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a quantity takeoff in construction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A quantity takeoff is the process of measuring and calculating all materials, labor, and equipment quantities from architectural blueprints and specifications. The ACE Services uses algorithmic digitization platforms for division-wise material volume counts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a construction cost estimate cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The ACE Services provides free preliminary quotes. Full estimate pricing is project-dependent based on square footage, scope complexity, and documentation quality. Use our online calculator for an instant budgetary allocation or contact us for a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats do you accept for blueprints?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept PDF, DWG, DXF, and raster image formats. Our digitization pipeline handles both digital-native files and scanned hard copies, with scale verification and alignment audits performed on scanned documents before quantity takeoffs begin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work with subcontractors and small contractors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, The ACE Services supports general contractors, subcontractors, and independent developers across 35 U.S. states, with scalable engagement models ranging from single-trade material lists to full-spectrum pre-construction packages.',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'The ACE Services Pre-Construction Process',
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

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The ACE Services',
  image: 'https://www.theaceservices.com/og-image.png',
  url,
  telephone: '+1-214-555-0123',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dallas',
    addressLocality: 'Dallas',
    addressRegion: 'TX',
    postalCode: '75001',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.7767,
    longitude: -96.797,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.linkedin.com/company/aceservicesllc/',
    'https://twitter.com',
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Construction Estimating',
  provider: {
    '@type': 'Organization',
    name: 'The ACE Services',
    url,
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction Estimating Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AACE Class 3 Cost Estimates',
          description: 'Professional budgetary-level cost estimates with ±10% to ±20% accuracy range, suitable for project funding authorization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Material Takeoffs',
          description: 'Detailed quantity surveys measuring all materials, labor, and equipment from architectural blueprints using algorithmic digitization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Permit Sets',
          description: 'Complete permit-ready document packages including cost schedules and material specifications for municipal submission.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Project Scheduling',
          description: 'Professional project timeline development and scheduling services for pre-construction planning.',
        },
      },
    ],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${url}/`,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        
        {/* Preconnect to critical third-party origins (max 4 per Lighthouse) */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* Preload Roboto Flex variable font (used by TextPressure in footer) */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
          as="style"
        />

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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
