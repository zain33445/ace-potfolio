export const SITE_URL = 'https://theaceservices.com';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const SERVICE_ID = `${SITE_URL}/#construction-estimating`;
export const GBP_URL = 'https://www.google.com/maps/place/The+ACE+Services/@29.8730417,-95.6557672,17z/data=!3m1!4b1!4m6!3m5!1s0x8640d74886712a23:0xfe66afe536f5553a!8m2!3d29.8730417!4d-95.6557672!16s%2Fg%2F11ybg9t9m0';

export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'The ACE Services',
  description:
    'The ACE Services is a pre-construction services firm delivering AACE Class 3 cost estimates, material takeoffs, MEP shop drawings, 3D architectural renderings, and permit sets for general contractors nationwide.',
  url: SITE_URL,
  logo: `${SITE_URL}/aceLogo.webp`,
  sameAs: ['https://www.facebook.com/share/1DWoUEzLig/', 'https://www.instagram.com/aceservicesllc?stkn=azlqMGRyOTNlbmQ3', 'https://www.linkedin.com/company/ace-services-official/', GBP_URL],
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
  telephone: '+1-346-458-0237',
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
  sameAs: ['https://www.facebook.com/share/1DWoUEzLig/', 'https://www.instagram.com/aceservicesllc?stkn=azlqMGRyOTNlbmQ3', 'https://www.linkedin.com/company/ace-services-official/', GBP_URL],
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
          name: 'Shop Drawings',
          description:
            'Fabrication-ready MEP, structural, millwork, and architectural shop drawings coordinated to resolve spatial conflicts before fabrication and installation.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '3D Architectural Rendering',
          description:
            'Photorealistic 3D exterior and interior architectural renderings that support permitting, stakeholder sign-off, and marketing presentation.',
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

export const PERSON_ID = `${SITE_URL}/#author-amz`;

export const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Abdul Manan Zafar',
  honorificPrefix: 'Engr.',
  jobTitle: 'Chief Executive Officer',
  description:
    'Civil engineer and CEO of The ACE Services, a pre-construction estimating firm serving general contractors across the United States.',
  url: `${SITE_URL}/authors/abdul-manan-zafar/`,
  image: 'https://cms.theaceservices.com/wp-content/uploads/2024/11/Engr._Abdul_Manan-removebg-preview.png',
  worksFor: { '@id': ORGANIZATION_ID },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Engineering and Technology, Lahore',
  },
  knowsAbout: [
    'Civil engineering',
    'Construction project management',
    'Quantity surveying',
    'Construction site management',
    'Construction health and safety',
  ],
  sameAs: ['https://pk.linkedin.com/in/abdul-manan-3390121b1'],
};

export const websiteGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': [organizationSchema, websiteSchema, localBusinessSchema],
};
