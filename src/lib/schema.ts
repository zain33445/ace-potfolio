export const SITE_URL = 'https://www.theaceservices.com';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const SERVICE_ID = `${SITE_URL}/#construction-estimating`;

export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'The ACE Services',
  description:
    'The ACE Services is a top construction and estimation company delivering AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide.',
  url: SITE_URL,
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'The ACE Services',
  url: SITE_URL,
  publisher: { '@id': ORGANIZATION_ID },
};

export const localBusinessSchema = {
  '@type': 'ProfessionalService',
  '@id': BUSINESS_ID,
  name: 'The ACE Services',
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: '+1-281-899-0250',
  email: 'info@theaceservices.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '16319 Hillside Garden LN',
    addressLocality: 'Houston',
    addressRegion: 'TX',
    postalCode: '77084',
    addressCountry: 'US',
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
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: 'Construction Estimating Service',
  serviceType: 'Construction Estimating',
  provider: { '@id': ORGANIZATION_ID },
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
            'Budgetary-level cost estimates delivered to AACE Class 3 standards using localized material databases and CSI MasterFormat divisions, typically within ±10% to ±20% accuracy and suitable for project funding authorization.',
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

export const websiteGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': [organizationSchema, websiteSchema, localBusinessSchema, serviceSchema],
};
