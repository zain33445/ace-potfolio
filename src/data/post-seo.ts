/**
 * Per-post <title> and meta description overrides for CMS blog posts.
 *
 * The CMS is stock WordPress with no SEO plugin, so a post carries exactly
 * one title — which is also its H1 — and an auto-excerpt. Neither works as a
 * search result:
 *
 *   - Every one of the live posts has a title over 60 characters once the
 *     "| The ACE Services" suffix is added, so every one of them is truncated
 *     in the SERP. "Construction Change Orders: Why They Happen and How
 *     Accurate Estimating Prevents Them | The ACE Services" is 104 characters
 *     and gets cut at "and How Accurate".
 *   - 73 of the 78 posts WordPress returns have excerpts that stop
 *     mid-sentence, because WordPress clips its
 *     auto-excerpt at 55 words and `cleanExcerpt` strips the trailing "[…]"
 *     read-more marker.
 *
 * The description problem is fixed generically — `leadDescription()` in
 * services/wordpress/html.ts builds a snippet from the post's own opening
 * sentences, which is better than the excerpt for every post, because these
 * posts are written answer-first. So descriptions here are the exception:
 * only for posts where a hand-written snippet beats the opening line.
 *
 * Titles cannot be fixed generically — shortening one needs a judgement about
 * what the post is actually about, so every post gets an explicit entry.
 * A post's title still has to work as its H1, so the fix cannot be to shorten
 * it in WordPress instead.
 *
 * 63 entries: WordPress returns 78 posts, but 15 of them are 301-redirected
 * into service pages by the middleware and never render, so they get no entry.
 *
 * Ordered newest first. Anything not listed falls back to the post title plus
 * the brand suffix.
 */

export interface PostSeo {
  /** Replaces the whole <title>, brand suffix included. Aim for ≤60 chars. */
  title?: string;
  /** Replaces the meta/og description. Aim for 150–160 chars. */
  description?: string;
}

export const POST_SEO: Record<string, PostSeo> = {
  'mep-coordination-clash-detection': {
    title: 'MEP Coordination and Clash Detection Explained',
  },
  'construction-change-order-causes-prevention': {
    title: 'Construction Change Orders: Causes and How to Prevent Them',
    description:
      'Change orders trace back to five recurring causes: loose takeoffs, design errors, MEP clashes, scope changes and site conditions. How to catch each one early.',
  },
  'how-to-read-construction-blueprints': {
    title: 'How to Read Construction Blueprints: A 5-Step Guide',
    description:
      'Estimators read a blueprint in a fixed order: title block and scale, then plans, elevations and sections, then schedules and specs. The full sequence.',
  },
  'residential-construction-estimation-save-thousands': {
    title: 'Residential Construction Cost Estimation: A Full Guide',
  },
  'industrial-estimation-the-complete-guide-for-us-contractors': {
    title: 'Industrial Estimation: A Guide for US Contractors',
  },
  'quantity-surveyor-vs-cost-estimator-key-differences': {
    title: 'Quantity Surveyor vs Cost Estimator: Key Differences',
  },
  'permit-sets-for-construction-complete-guide': {
    title: 'Permit Sets for Construction: What to Include',
  },
  'commercial-construction-estimation-guide': {
    title: 'Commercial Construction Estimating: A Guide for GCs',
  },
  'outsourcing-construction-estimation-the-smart-move': {
    title: 'Why Outsourcing Construction Estimation Pays Off',
  },
  'outsource-estimation-services-to-improve-accuracy-and-maximize-profits': {
    title: 'Outsource Estimating to Improve Accuracy and Profit',
  },
  'industrial-estimation-explained-cost-planning-for-industrial-construction-projects': {
    title: 'Industrial Estimation: Cost Planning Explained',
  },
  'commercial-estimation-process-from-takeoffs-to-final-budgets': {
    title: 'Commercial Estimating: From Takeoffs to Budgets',
  },
  'what-is-freelance-estimation-a-complete-guide-for-contractors': {
    title: 'What Is Freelance Estimation? A Contractor Guide',
  },
  'how-construction-estimation-works-in-residential-and-commercial-projects': {
    title: 'How Construction Estimation Works',
  },
  'hotel-development-services-explained-from-planning-to-project-completion': {
    title: 'Hotel Development: From Planning to Completion',
  },
  'outsource-estimating-services-a-complete-guide-for-construction-projects': {
    title: 'Outsourced Estimating Services: A Complete Guide',
  },
  'how-outsource-estimation-services-help-businesses-save-time-and-money': {
    title: 'How Outsourced Estimating Saves Time and Money',
  },
  'accurate-construction-estimating': {
    title: 'Construction Estimating Services in Florida',
  },
  'residential-commercial-and-industrial-construction-estimation-in-michigan': {
    title: 'Construction Estimating Services in Michigan',
  },
  'reliable-construction-estimation-and-design-support-in-north-carolina': {
    title: 'Construction Estimating and Design in North Carolina',
  },
  'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter': {
    title: 'Construction Estimators in Pennsylvania',
  },
  'blueprint-estimation-experts-serving-builders-across-georgia': {
    title: 'Blueprint Estimation Services in Georgia',
  },
  'comprehensive-construction-estimating-services-in-ohio': {
    title: 'Construction Estimating Services in Ohio',
  },
  'end-to-end-construction-solutions-in-new-york-from-design-to-estimation': {
    title: 'Construction Estimating and Design in New York',
  },
  'industrial-and-residential-construction-estimation-services-in-illinois': {
    title: 'Construction Estimating Services in Illinois',
  },
  'top-construction-estimation-services-in-california-building-precision-and-trust-statewide': {
    title: 'Construction Estimating Services in California',
  },
  'residential-and-commercial-construction-solutions-in-texas-powered-by-the-ace-services': {
    title: 'Construction Estimating Services in Texas',
  },
  'bridging-the-gap-nationwide-estimating-services-for-bridges-parks-and-public-infrastructure': {
    title: 'Estimating for Bridges, Parks and Public Infrastructure',
  },
  'why-u-s-developers-choose-the-ace-services-for-accurate-and-timely-estimation': {
    title: 'Why US Developers Choose The ACE Services',
  },
  'cost-effective-construction-services-across-the-usa-quality-meets-precision': {
    title: 'Cost-Effective Construction Services Across the USA',
  },
  'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa': {
    title: 'Public, Educational and Healthcare Construction',
  },
  'the-future-of-construction-estimating-u-s-trends-every-contractor-should-know-in-2025': {
    title: 'The Future of Construction Estimating: 2025 Trends',
  },
  'how-modern-estimation-tools-are-revolutionizing-construction-projects-across-the-u-s-a': {
    title: 'How Modern Estimating Tools Are Changing Construction',
  },
  'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america': {
    title: 'Specialized Construction Estimating by Building Type',
  },
  'nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development': {
    title: 'Supporting US Builders Nationwide',
  },
  'end-to-end-construction-services-in-the-usa-design-estimation-and-development-expertise': {
    title: 'End-to-End Construction Services in the USA',
  },
  'your-go-to-estimating-partner-for-projects-in-texas-california-florida-beyond': {
    title: 'Estimating Services in Texas, California and Florida',
  },
  'why-accurate-estimation-matters-in-large-scale-projects-across-the-usa': {
    title: 'Why Accurate Estimating Matters on Large Projects',
  },
  'nationwide-construction-support-residential-commercial-and-industrial-projects-covered': {
    title: 'Nationwide Residential and Commercial Construction',
  },
  'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design': {
    title: 'Estimation and Design Support in All 50 States',
  },
  'expanding-horizons-construction-estimating-solutions-for-every-u-s-state': {
    title: 'Construction Estimating Solutions for Every US State',
  },
  'building-america-the-ace-services-role-in-developing-residential-and-commercial-projects-nationwide': {
    title: 'Residential and Commercial Development Across the USA',
  },
  'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services': {
    title: 'State-to-State Construction Estimating Services',
  },
  'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management': {
    title: 'Construction Estimation, Design and Project Management',
  },
  'from-residential-to-industrial-how-the-ace-services-powers-construction-projects-nationwide': {
    title: 'Estimating for Residential, Commercial and Industrial',
  },
  'top-construction-estimation-services-in-the-usa-building-accuracy-across-every-state': {
    title: 'Top Construction Estimating Services in the USA',
  },
  'educational-building-development-services-in-usa-creating-modern-sustainable-and-inspiring-learning-spaces': {
    title: 'Educational Building Development Services in the USA',
  },
  'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects': {
    title: 'Quantity Surveyor Services: Accuracy and Efficiency',
  },
  'warehouse-development-in-usa-key-trends-strategies-and-future-opportunities': {
    title: 'Warehouse Development: Trends and Opportunities',
  },
  'hotel-development-services-in-usa-building-the-future-of-hospitality': {
    title: 'Hotel Development Services in the USA',
  },
  'exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers': {
    title: 'Construction and Estimation Services in the USA',
  },
  'industrial-estimation-services-usa-the-key-to-smarter-construction-planning': {
    title: 'Industrial Estimation Services in the USA',
  },
  'best-outsource-construction-and-estimation-services-in-usa': {
    title: 'Best Outsourced Estimating Services in the USA',
  },
  'professional-hotels-development-services-in-usa': {
    title: 'Professional Hotel Development Services in the USA',
  },
  'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them': {
    title: 'Educational Building Construction Services Explained',
  },
  'top-construction-and-estimation-services-in-usa-quality-accuracy-trust': {
    title: 'Construction Estimating: Quality, Accuracy and Trust',
  },
  'quantity-surveyor-services-what-they-are-and-why-your-project-needs-them': {
    title: 'Quantity Surveyor Services: What They Are',
  },
  'everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights': {
    title: 'Blueprint Estimation Services: Process, Benefits, Cost',
  },
  'everything-you-need-to-know-about-exploring-the-leading-construction-and-estimation-services-in-usa': {
    title: 'Leading Construction and Estimation Services in the USA',
  },
  'outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors': {
    title: 'Outsourced Construction Estimating: Key Advantages',
  },
  'everything-you-need-to-know-about-educational-building-construction-services-in-usa': {
    title: 'Educational Building Construction Services in the USA',
  },
  'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects': {
    title: 'Hotel Development for Profitable Hospitality Projects',
  },
  'what-you-need-to-know-about-warehouse-development-services-in-the-usa': {
    title: 'Warehouse Development Services: What to Know',
  },
};

export function getPostSeo(slug: string): PostSeo {
  return POST_SEO[slug] ?? {};
}
