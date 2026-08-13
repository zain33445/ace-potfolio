export const SITE_URL = 'https://www.theaceservices.com';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The ACE Services',
  description:
    'The ACE Services is a top construction and estimation company delivering AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide.',
  url: SITE_URL,
  areaServed: 'US',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The ACE Services',
  url: SITE_URL,
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The ACE Services',
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: '+1-281-899-0250',
  email: 'info@theaceservices.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '16319 Hillside Garden LN',
    addressLocality: 'Houston',
    addressRegion: 'TX',
    postalCode: '77084',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 29.7604,
    longitude: -95.3698,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: ['https://www.linkedin.com/company/aceservicesllc/'],
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Construction Estimating',
  provider: {
    '@type': 'Organization',
    name: 'The ACE Services',
    url: SITE_URL,
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
          description:
            'Professional budgetary-level cost estimates with ±10% to ±20% accuracy range, suitable for project funding authorization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Material Takeoffs',
          description:
            'Detailed quantity surveys measuring all materials, labor, and equipment from architectural blueprints using algorithmic digitization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Permit Sets',
          description:
            'Complete permit-ready document packages including cost schedules and material specifications for municipal submission.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Project Scheduling',
          description:
            'Professional project timeline development and scheduling services for pre-construction planning.',
        },
      },
    ],
  },
};
